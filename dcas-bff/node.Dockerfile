FROM node:7.9.0-alpine

ARG NODE_ENV=production
ARG NODE_PORT=5000
# ONBUILD ARG NODE_HOST
ENV NODE_PORT=$NODE_PORT NODE_ENV=$NODE_ENV

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

# From here we load our application's code in, therefore the previous docker
# "layer" thats been cached will be used if possible
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install && \
    npm run build
    # npm cache clean && \
    # npm prune --production

#RUN npm build
EXPOSE $NODE_PORT
CMD npm run serve 