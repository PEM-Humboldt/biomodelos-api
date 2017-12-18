FROM node:9.3.0-onbuild
MAINTAINER Valentina Grajales Olarte (lgrajales@humboldt.org.co)

RUN npm run build
EXPOSE 3000
