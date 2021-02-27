# Build
FROM node:14 as builder

WORKDIR /build

COPY yarn.lock package.json ./
COPY packages/api-client/package.json packages/api-client/
COPY packages/entities/package.json packages/entities/
COPY packages/ui/package.json packages/ui/

RUN yarn install

COPY . .

ARG VUE_APP_BOKARI_API_URL
RUN yarn lerna run --scope "@bokari/{api-client,entities,ui}" --stream build

# Runtime
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/*

COPY packages/ui/nginx /etc/nginx/conf.d/
COPY --from=builder /build/packages/ui/dist /usr/share/nginx/html

EXPOSE 80
