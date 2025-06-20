FROM node:18.15.0-alpine3.17

WORKDIR /app

RUN npm i -g @nestjs/cli

COPY package.json ./

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "run", "start:dev"]