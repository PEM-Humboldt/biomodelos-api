FROM node:9.4.0
MAINTAINER Valentina Grajales Olarte (lgrajales@humboldt.org.co)

USER node
WORKDIR /home/node/

RUN mkdir -p /home/node/app
WORKDIR /home/node/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY --chown=node:node . /home/node/app

RUN npm install && npm cache clean --force
RUN npm run build
RUN echo "{}" > dist/server/config/config.json

EXPOSE 3000
CMD [ "npm", "start" ]
