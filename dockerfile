
FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install --only=production

USER node

EXPOSE 3000

CMD ["node", "server.js"]