# Bokari

Contract tracking app for small businesses

![Contract detail](contract-screen.readme.png)

## Quick run

1. make sure docker and docker-compose are installed on your system
2. edit the file `./docker-compose.yml` based on your environment
    * these variables are **REQUIRED** to be changed or passed while running docker-compose up:
        * JWT_PRIVATE_KEY
        * JWT_PUBLIC_KEY

## Development setup

### 1. Install necessary tools

* node 14+
* postgres
* yarn 1.4+

### 2. Setup your postgres instance

Create an empty database in your Postgres instance. By default the server expects it to be named "bokari" with a "public" schema.

### 3. Setup your API server configuration
1. Configure and pass these environment variables to your API server either by adding them to `packages/api-server/.env` or passing them manually to the process
   * Pay attention to the JWT_(PRIVATE|PUBLIC)_KEY variables. The server expects them to be a valid RSA256 keys and will either not verify tokens correctly or won't start at all if correct values are not provided.

```sh
# with current server implementation, can be postgres or mysql
# only postgres is tested
TYPEORM_CONNECTION=postgres
# address or hostname of your database instance
TYPEORM_HOST=database_address
# database user credentials
TYPEORM_USERNAME=postgres
TYPEORM_PASSWORD=changeme
# name of the database in your database instance
TYPEORM_DATABASE=bokari
# port on which the database listens on
TYPEORM_PORT=5432
# whether to ALTER target schema to match local ORM entities
TYPEORM_SYNCHRONIZE=true
# whether to log executed SQL queries to STDOUT
TYPEORM_LOGGING=true
# absolute path where to persistently store 
BOKARI_UPLOADS_STORAGE_DIR=/app/uploads
# RSA256 private ky in PEM format
JWT_PRIVATE_KEY=changeme
# RSA256 public key in PEM format
JWT_PUBLIC_KEY=changeme
# port on which the API server will listen on
PORT=3000
```

### 5. Set the URL your API server listens on

Create a file `packages/ui/.env` with this variable set to your desired URL.

```sh
VUE_APP_BOKARI_API_URL="http://localhost:3000"
```

### 4. Install projects node dependencies

In the root project folder run this command:

```bash
yarn install
```

It should have installed all the needed js libraries/tools and nest it in the project's node_modules directories. No need to worry about polluting your system files.

### 5. Build the project

#### Build all subprojects at once

```bash
yarn build
```

### 6. Start the services

From the repo's directory run these commands in their own shell instances

```bash
# Start the webpack dev server to serve the UI
yarn workspace @bokari/ui serve
# Start the API server
yarn workspace @bokari/api-server start
```
