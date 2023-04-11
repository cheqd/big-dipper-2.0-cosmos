ARG PROJECT_NAME=web-cheqd

# This is a multiple stage Dockerfile.
# - Stage 1: starter (base image with Node.js 18 and the turbo package installed globally)

# - Stage 2: pruner (copies all necessary files and sets up yarn configurations, runs turbo prune)

# - Stage 3: builder (adds dependencies, environment variables, and builds the project using yarn)

# - Stage 4: runner (final image for the web project, sets environment variables, starts the server)

# Stage: starter
FROM node:18 AS starter

SHELL ["/bin/bash", "-euo", "pipefail", "-c"]

WORKDIR /app
RUN npm i -g turbo

# Stage: pruner
FROM starter AS pruner

COPY ./ ./

ARG PROJECT_NAME=web-cheqd
RUN yarn config set nodeLinker node-modules \
  && yarn config set supportedArchitectures --json '{}' \
  && turbo prune --scope=${PROJECT_NAME} --docker

################################################################################

# Stage: builder
FROM starter AS builder

### First install the dependencies (as they change less often)
COPY .yarnrc.yml ./
COPY .yarn/ ./.yarn/
COPY --from=pruner /app/out/json/ /app/out/yarn.lock ./

## Setting up the environment variables for the docker container.
ARG PROJECT_NAME=web-cheqd
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG BASE_PATH=/
ENV BASE_PATH=${BASE_PATH}
ENV CI=1
ENV HUSKY=0
ENV BUILD_STANDALONE=1

# add placeholder for env variables to be injected in runner stage
ENV NEXT_PUBLIC_CHAIN_TYPE={{NEXT_PUBLIC_CHAIN_TYPE}}
ENV NEXT_PUBLIC_GRAPHQL_URL={{NEXT_PUBLIC_GRAPHQL_URL}}
ENV NEXT_PUBLIC_GRAPHQL_WS={{NEXT_PUBLIC_GRAPHQL_WS}}
ENV NEXT_PUBLIC_RPC_WEBSOCKET={{NEXT_PUBLIC_RPC_WEBSOCKET}}

RUN corepack enable && yarn -v \
  && yarn config set supportedArchitectures --json '{}' \
  && YARN_ENABLE_IMMUTABLE_INSTALLS=false yarn install --inline-builds

## Build the project
COPY --from=pruner /app/out/full/ ./
RUN yarn node packages/shared-utils/configs/sentry/install.js \
  && yarn workspace ${PROJECT_NAME} add sharp \
  && yarn workspace ${PROJECT_NAME} run build

################################################################################

# Stage: runner
FROM node:18 AS runner
 
# Copying the files from the builder stage to the runner stage.
ARG PROJECT_NAME=web-cheqd
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_CHAIN_TYPE=testnet
ENV NEXT_PUBLIC_CHAIN_TYPE=${NEXT_PUBLIC_CHAIN_TYPE}
ARG NEXT_PUBLIC_GRAPHQL_URL=https://testnet-gql.cheqd.io/v1/graphql
ENV NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
ARG NEXT_PUBLIC_GRAPHQL_WS=wss://testnet-gql.cheqd.io/v1/graphql
ENV NEXT_PUBLIC_GRAPHQL_WS=${NEXT_PUBLIC_GRAPHQL_WS}
ARG NEXT_PUBLIC_RPC_WEBSOCKET=wss://rpc.cheqd.network/websocket
ENV NEXT_PUBLIC_RPC_WEBSOCKET=${NEXT_PUBLIC_RPC_WEBSOCKET}
ARG PORT=3000
ENV PORT=${PORT:-3000}

WORKDIR /app/apps/${PROJECT_NAME}

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && chown -R nextjs:nodejs /home/nextjs /app

COPY --chown=nextjs:nodejs --from=builder \
  /app/package.json /app/.pnp.* /app/.yarnrc.yml /app/yarn.lock \
  ../../
COPY --chown=nextjs:nodejs --from=builder \
  /app/.yarn/ \
  ../../.yarn/
COPY --chown=nextjs:nodejs --from=builder \
  /app/apps/${PROJECT_NAME}/.next/apps/${PROJECT_NAME}/server.js /app/apps/${PROJECT_NAME}/package.json \
  ./
COPY --chown=nextjs:nodejs --from=builder \
  /app/apps/${PROJECT_NAME}/public/ \
  ./public/
COPY --chown=nextjs:nodejs --from=builder \
  /app/apps/${PROJECT_NAME}/.next/apps/${PROJECT_NAME}/.next/ \
  ./.next/
COPY --chown=nextjs:nodejs --from=builder \
  /app/apps/${PROJECT_NAME}/.next/static/ \
  ./.next/static/

# reference: https://github.com/vercel/next.js/discussions/34894
RUN printf 'const { readFileSync, writeFileSync } = require("fs");\n\
function inject(file) {\n\
  const code = readFileSync(file, "utf8").replace(/(['\
"'"\
'"`])[{][{](\
NEXT_PUBLIC_CHAIN_TYPE|\
NEXT_PUBLIC_GRAPHQL_URL|\
NEXT_PUBLIC_GRAPHQL_WS|\
NEXT_PUBLIC_RPC_WEBSOCKET\
)[}][}]\\1/gi, (match, quote, name) => {\n\
  console.log(`inject ${match} with ${JSON.stringify(process.env[name.toUpperCase()])} in ${file}`);\n\
  return JSON.stringify(process.env[name] ?? "")\n\
});\n\
  writeFileSync(file, code, "utf8");\n\
}\n' > ./inject.js \
  && egrep -ilr '[{][{](\
NEXT_PUBLIC_CHAIN_TYPE|\
NEXT_PUBLIC_GRAPHQL_URL|\
NEXT_PUBLIC_GRAPHQL_WS|\
NEXT_PUBLIC_RPC_WEBSOCKET\
)[}][}]' ./.next | xargs -I{} printf 'inject("'{}'");\n' | tee -a ./inject.js;

# Don't run production as root
USER nextjs

CMD ["/bin/bash", "-c","node ./inject.js && yarn node ./server.js"]
