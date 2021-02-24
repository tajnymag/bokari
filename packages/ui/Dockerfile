FROM node:14 as builder
WORKDIR /build
COPY . .
RUN yarn install
RUN yarn lerna run --scope "@bokari/{api-client,entities,ui}" --stream build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/*
COPY packages/ui/nginx /etc/nginx/conf.d/
COPY --from=builder /build/packages/ui/dist /usr/share/nginx/html
EXPOSE 80
