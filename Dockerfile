# syntax = docker/dockerfile:1

ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"
ARG YARN_VERSION=1.22.22
RUN npm install -g yarn@$YARN_VERSION --force

FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python3 python-is-python3

COPY package-lock.json package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

FROM base

COPY --from=build /app /app

EXPOSE 3000
CMD [ "yarn", "run", "start" ]