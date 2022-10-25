###############################################################
###        STAGE 1: Runtime BigDipper container        		###
###############################################################

FROM node:16-alpine AS bigdipper

# Install pre-requisite packages
RUN apk update && apk add --no-cache git bash

# Set working directory & bash defaults
WORKDIR /home/node/app

# Copy source files
COPY . .

# Installing dependencies
RUN yarn install

# Build-time arguments
ARG NODE_ENV="production"
ARG NEXT_PUBLIC_GRAPHQL_URL
ARG NEXT_PUBLIC_GRAPHQL_WS
ARG NEXT_PUBLIC_RPC_WEBSOCKET
ARG NEXT_PUBLIC_CHAIN_TYPE
ARG PORT=3000

# Run-time environment variables
ENV NEXT_PUBLIC_GRAPHQL_URL https://testnet-gql.cheqd.io/v1/graphql
ENV NEXT_PUBLIC_GRAPHQL_WS wss://testnet-gql.cheqd.io/v1/graphql
ENV NEXT_PUBLIC_RPC_WEBSOCKET wss://rpc.cheqd.network
ENV NEXT_PUBLIC_CHAIN_TYPE testnet
ENV NODE_ENV ${NODE_ENV}
ENV PORT ${PORT}

# Building app
RUN yarn build

# Specify default port
EXPOSE ${PORT}

# Set user and shell
USER node
SHELL ["/bin/bash", "-euo", "pipefail", "-c"]

# Run the application
CMD [ "yarn", "run", "start" ]
