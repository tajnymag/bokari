# bokari

Contract tracking app for small businesses

## Development setup

### 1. Install necessary tools

* node 14+
* postgres
* yarn 1.4+

### 2. Setup your postgres instance

1. In your postgres instance, run create and insert script from the `packages/database/sql` directory. This should setup the database structure as needed.

    BE CAREFUL, create.sql automatically drops the `public` scheme and recreates it. Be sure to run it in an isolated database.

2. Make a copy of the file `packages/database/.env.example`, name it as `packages/database/.env` and edit its contents based on your postgres instance info.

### 3. Install projects node dependencies

In the root project folder run this command:

```bash
yarn install && yarn lerna run generate:client --scope @bokari/database && yarn lerna bootstrap
```

It should have installed all the needed js libraries/tools and nest it in the project's node_modules directories. No need to worry about polluting your system files.

### 4. Build the project

#### Build all subprojects at once

```bash
yarn build
```
