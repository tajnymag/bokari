FROM node:14 AS builder
WORKDIR /build
COPY . .
RUN yarn install && yarn lerna run build --scope @bokari/api-server && rm -r node_modules packages/*/node_modules

FROM node:14
WORKDIR /app
COPY --from=builder /build .
RUN yarn workspace @bokari/api-server install --production
CMD ["yarn workspace @bokari/api-server run start"]
