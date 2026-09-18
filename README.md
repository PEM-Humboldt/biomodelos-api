# BioModelos

The API handles all operations related with models, species and records of the BioModelos platform.

## Requirements
* Nodejs v24.15.0
* npm v11.12.1
* MongoDB database running v7.0

### For deployment
* Docker v18+

## DEV

### Install dependencies
After cloning the project, install its dependencies running: `npm i`

### Setup
The file [config.json](src/config/config.json) has the environmetal variables for setup the database configuration.

### Run

Use this command to start the server on port 3000:
```bash
BIOMODELS_DB=<database> BIOMODELS_DB_SERVERS=<'["host:port"]'> BIOMODELS_DB_USER=<database_user> BIOMODELS_DB_PASS=<database_password> npm run dev
```
this will launch nodemon, ready to watch your changes.

### ESLint
The project uses [ESLint v9.x](https://eslint.org/docs/v9.x/), a tool for identifying and reporting patterns in ECMAScript/JavaScript code, with the goal of achieving greater consistency and preventing errors.

Currently, this project uses ECMAScript version 7.

The project includes a script defined in the package.json file. You can use it with these instructions to fix errors one by one:

```
 npm run lint
```
Then, you can use these instructions to automatically fix some errors:

```
npx eslint --fix src
```
Note: Only formatting errors can be fixed automatically.

# Deployment

Deployment is made with docker, you'll need Docker v17.05.0+ and docker compose v1.17.1+

### Build image

To build the image run: `docker build -t biomodelos_api:<version> .`

It is recommended to use the [current release](https://github.com/LBAB-Humboldt/biomodelos_db_api/releases) for the image tag version.

### Deploy container

> If you set the `NODE_ENV` var to "production" in the container it will create the folder `/home/node/app/logs` to store the logs. Its recommended to link the logs folder inside the container to a folder in the  host machine.

To deploy the container in port 3000 run:
```bash
docker run --name biomodelos_api -p port:3000 \
-v ./src/config/config.json:/home/node/app/dist/server/config/config.json \
-v ./logs:/home/node/app/logs \
-e NODE_ENV=production \
-e BIOMODELS_DB=<database> \
-e BIOMODELS_DB_SERVERS=<'['host:port']'> \
-e BIOMODELS_DB_USER=<database_user> \
-e BIOMODELS_DB_PASS=<database_password> \
-d biomodelos_api:<version>
```
