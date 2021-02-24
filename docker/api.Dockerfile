FROM node:14
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn lerna run --scope "@bokari/{api-server,api-specs,entities} build

WORKDIR /app/packages/api-server
EXPOSE 3000
CMD ["yarn", "start"]
