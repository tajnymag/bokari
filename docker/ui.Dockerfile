FROM node:14 as builder
WORKDIR /build
COPY . .
RUN yarn install
RUN yarn lerna run --scope "@bokari/{api-client,entities,ui}" build

FROM nginx:alpine
COPY --from=builder /build/packages/ui/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
