FROM node:7.9.0-alpine

ARG NODE_ENV=production
ARG NODE_PORT=5000
ENV NODE_PORT=$NODE_PORT NODE_ENV=$NODE_ENV

RUN mkdir -p /usr/src/app && mkdir -p /usr/src/app/node_modules/hapi-swagger && mkdir -p /usr/src/app/dist
WORKDIR /usr/src/app
RUN pwd && ls
COPY dist /dist/
COPY assets /usr/src/app/assets/
COPY node_modules/hapi-swagger/* /usr/src/app/node_modules/hapi-swagger/

#RUN npm build
EXPOSE $NODE_PORT
CMD node dist/index.js