#base image  
FROM node:16

WORKDIR /game

COPY . .

RUN npm install  
RUN unset NODE_OPTIONS
RUN export NODE_OPTIONS=--openssl-legacy-provider

CMD  ["npm","start"]
