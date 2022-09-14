###############################################################
###        		STAGE 1: Build BigDipper UI        			###
###############################################################

FROM node:16-alpine AS bigdipper

# Install pre-requisite packages
RUN apk update && apk add --no-cache git bash

# Set user directory and details
ARG HOME_DIR="/bigdipper"
ARG USER="bigdipper"
SHELL ["/bin/bash", "-euo", "pipefail", "-c"]

# Add non-root user to use in the container
RUN addgroup --system $USER \
    && adduser $USER --system --home $HOME_DIR --shell /bin/bash

# Set working directory & bash defaults
WORKDIR $HOME_DIR
USER $USER

# Copy source files
COPY . .

# Installing dependencies
RUN npm ci

# Build-time arguments
ARG NODE_ENV="production"
ARG PORT=8080

# Run-time environment variables
ENV NEXT_PUBLIC_GRAPHQL_URL ${NEXT_PUBLIC_GRAPHQL_URL}
ENV NEXT_PUBLIC_GRAPHQL_WS ${NEXT_PUBLIC_GRAPHQL_WS}
ENV NEXT_PUBLIC_URL ${NEXT_PUBLIC_URL}
ENV NEXT_PUBLIC_WS_CHAIN_URL ${NEXT_PUBLIC_WS_CHAIN_URL}
ENV NEXT_PUBLIC_CHAIN_TYPE ${NEXT_PUBLIC_CHAIN_TYPE}
ENV NODE_ENV ${NODE_ENV}
ENV PORT ${PORT}

# Build the app
RUN npm run build
EXPOSE ${PORT}

# Run the application
ENTRYPOINT [ "node", "dist/index.js" ]
