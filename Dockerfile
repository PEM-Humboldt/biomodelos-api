FROM node:24.15.0-alpine

USER node
WORKDIR /home/node/

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
COPY --chown=node:node . /home/node/app

RUN npm install && npm cache clean --force
RUN mkdir -p dist logs
RUN npm run build
RUN echo "{}" > dist/server/config/config.json

EXPOSE 3000
CMD [ "npm", "start" ]
