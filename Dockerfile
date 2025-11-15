FROM imbios/bun-node:22-slim as builder
ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /app

COPY package.json pnpm-lock.yaml ./ 

RUN apt-get -y update \
  && apt-get install -yq openssl git ca-certificates tzdata \
  && ln -fs /usr/share/zoneinfo/Asia/Jakarta /etc/localtime \
  && dpkg-reconfigure -f noninteractive tzdata \
  && npm i -g corepack \
  && corepack enable \
  && pnpm install

COPY . .

RUN pnpm build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html