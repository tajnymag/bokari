FROM node:14
# Build
WORKDIR /app

COPY yarn.lock package.json ./
COPY packages/entities/package.json packages/entities/
COPY packages/api-specs/package.json packages/api-specs/
COPY packages/api-server/package.json packages/api-server/

RUN yarn install

COPY . .

RUN yarn lerna run --scope "@bokari/{api-server,api-specs,entities}" --stream build

# Runtime
WORKDIR /app/packages/api-server
EXPOSE 3000
CMD ["yarn", "start"]
