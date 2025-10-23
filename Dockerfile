# Dockerfile

ARG NODE_VERSION=22.12.0
FROM node:${NODE_VERSION}-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable

ARG PORT=3000
WORKDIR /src

# Build
FROM base as build

COPY . .

# Ensure a clean install
RUN rm -rf node_modules

RUN pnpm install --frozen-lockfile
RUN npm install --platform=linux --arch=x64 sharp
RUN pnpm run generate

FROM base

COPY --from=build /src/.output /src/.output
# Optional, only needed if you rely on unbundled dependencies
COPY --from=build /src/node_modules /src/node_modules

CMD ["npx", "serve", ".output/public", "-l", "3000"]