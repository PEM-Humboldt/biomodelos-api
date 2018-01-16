FROM node:9.4.0-onbuild
MAINTAINER Valentina Grajales Olarte (lgrajales@humboldt.org.co)

RUN npm run build
EXPOSE 3000
