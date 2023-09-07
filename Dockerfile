#base image  
FROM node:16

WORKDIR /game

COPY . .

RUN npm install  

CMD  ["npm","start"]
