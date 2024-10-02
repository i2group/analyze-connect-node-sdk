FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /exampleconnector

COPY package.json ./

RUN npm install

COPY config ./config
COPY people.json ./
COPY dist ./dist

EXPOSE 3700

CMD ["npm", "run" , "serve"]
