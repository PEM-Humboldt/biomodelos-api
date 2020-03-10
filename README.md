# BioModelos

The API handles all operations related with models, species and records of the BioModelos platform.

## Requirements
* Nodejs v9.4+
* npm v6.4+
* MongoDB database running v3.6

### For deployment
* Docker v18+

## DEV

### Install dependencies
After cloning the project, install its dependencies running: `npm i`

### Setup
Copy [config_template.json](src/config/config_template.json) file in the same location and set up database credentials and server configuration values. Name this file `config.json`.

### Run
Run `npm run dev` to start the server, this will launch nodemon, ready to watch your changes.

# Deployment

Deployment is made with docker, you'll need Docker v17.05.0+ and docker compose v1.17.1+

### Build image

To build the image run: `docker build -t biomodelos_api:<version> .`

It is recommended to use the [current release](https://github.com/LBAB-Humboldt/biomodelos_db_api/releases) for the image tag version.

### Deploy container

> If you set the `NODE_ENV` var to "production" in the container it will create the folder `/home/node/app/logs` to store the logs. Its recommended to link the logs folder inside the container to a folder in the  host machine.

To deploy the container in port 3000 run:
```
docker run --name biomodelos_api -p 3000:3000 -v ./src/config/config.json:/home/node/app/dist/server/config/config.json -v ./logs:/home/node/app/logs -e NODE_ENV=production -d biomodelos_api:<version>
```
