FROM node:14.5.0-alpine

# Install git for ui and internal packages
RUN apk add --no-cache git

# Set app directory
WORKDIR /app

# Installing dependencies
COPY package*.json ./
RUN npm ci

# Copying source files
COPY . .

# Get env from secrets
ARG NEXT_PUBLIC_GRAPHQL_URL
ARG NEXT_PUBLIC_GRAPHQL_WS
ARG NEXT_PUBLIC_RPC_WEBSOCKET
ARG NEXT_PUBLIC_CHAIN_TYPE
ARG NODE_ENV

# Generate env file
ENV NEXT_PUBLIC_GRAPHQL_URL ${NEXT_PUBLIC_GRAPHQL_URL}
ENV NEXT_PUBLIC_GRAPHQL_WS ${NEXT_PUBLIC_GRAPHQL_WS}
ENV NEXT_PUBLIC_RPC_WEBSOCKET ${NEXT_PUBLIC_RPC_WEBSOCKET}
ENV NEXT_PUBLIC_CHAIN_TYPE ${NEXT_PUBLIC_CHAIN_TYPE}
ENV NODE_ENV ${NODE_ENV}
ENV PORT 3000

# Building app
RUN npm run build
EXPOSE ${PORT}

#Run the application
CMD ["npm", "run", "start"]
