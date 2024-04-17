ARG PROJECT_NAME=web-cheqd

# This is a multiple stage Dockerfile.
# - Stage 1: starter (base image with Node.js 18 and the turbo package installed globally)

# - Stage 2: pruner (copies all necessary files and sets up yarn configurations, runs turbo prune)

# - Stage 3: builder (adds dependencies, environment variables, and builds the project using yarn)

# - Stage 4: runner (final image for the web project, sets environment variables, starts the server)

# Stage: starter
FROM node:18-alpine3.18 AS starter

WORKDIR /app
RUN npm i -g turbo

# Stage: pruner
FROM starter AS pruner

COPY ./ ./

ARG PROJECT_NAME=web-cheqd
ENV PROJECT_NAME=${PROJECT_NAME}
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
ARG NODE_ENV=production
ARG NEXT_TELEMETRY_DISABLED=1
ARG BASE_PATH=/
ENV CI=1
ENV HUSKY=0
ENV BUILD_STANDALONE=1
ARG PROJECT_NAME=web-cheqd
ENV PROJECT_NAME=${PROJECT_NAME}

# add placeholder for env variables to be injected in runner stage
ENV NODE_ENV={{NODE_ENV}}
ENV NEXT_TELEMETRY_DISABLED=${NEXT_TELEMETRY_DISABLED}
ENV BASE_PATH=${BASE_PATH}
ARG NEXT_PUBLIC_CHAIN_TYPE
ENV NEXT_PUBLIC_CHAIN_TYPE=${NEXT_PUBLIC_CHAIN_TYPE}
ARG NEXT_PUBLIC_GRAPHQL_URL
ENV NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
ARG NEXT_PUBLIC_GRAPHQL_WS
ENV NEXT_PUBLIC_GRAPHQL_WS=${NEXT_PUBLIC_GRAPHQL_WS}
ARG NEXT_PUBLIC_RPC_WEBSOCKET
ENV NEXT_PUBLIC_RPC_WEBSOCKET=${NEXT_PUBLIC_RPC_WEBSOCKET}

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
FROM node:18-alpine3.18 AS runner
 
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_CHAIN_TYPE
ENV NEXT_PUBLIC_CHAIN_TYPE=${NEXT_PUBLIC_CHAIN_TYPE}
ARG NEXT_PUBLIC_GRAPHQL_URL
ENV NEXT_PUBLIC_GRAPHQL_URL=${NEXT_PUBLIC_GRAPHQL_URL}
ARG NEXT_PUBLIC_GRAPHQL_WS
ENV NEXT_PUBLIC_GRAPHQL_WS=${NEXT_PUBLIC_GRAPHQL_WS}
ARG NEXT_PUBLIC_RPC_WEBSOCKET
ENV NEXT_PUBLIC_RPC_WEBSOCKET=${NEXT_PUBLIC_RPC_WEBSOCKET}
ARG BASE_PATH
ENV BASE_PATH=${BASE_PATH}
ENV CI=1
ENV HUSKY=0
ENV BUILD_STANDALONE=1
ARG PORT=3000
ENV PORT=${PORT}
ARG PROJECT_NAME=web-cheqd
ENV PROJECT_NAME=${PROJECT_NAME}


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
  /app/apps/${PROJECT_NAME}/ /app/apps/${PROJECT_NAME}/ \
  ./
COPY --chown=nextjs:nodejs --from=builder \
  /app/packages/ /app/packages/
COPY --chown=nextjs:nodejs --from=builder /app/node_modules/ /app/node_modules/

# Don't run production as root
USER nextjs

CMD yarn next start -p ${PORT}
