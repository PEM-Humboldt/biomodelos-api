FROM node:8.3.0-onbuild
MAINTAINER Valentina Grajales Olarte (lgrajales@humboldt.org.co)
ONBUILD RUN npm run build
EXPOSE 3000
