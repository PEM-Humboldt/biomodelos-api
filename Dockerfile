FROM node:9.4.0
MAINTAINER Valentina Grajales Olarte (lgrajales@humboldt.org.co)

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY . /usr/src/app

RUN npm install && npm cache clean --force
RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
