FROM node:16
WORKDIR /app

COPY package.json .
COPY ./dist ./
RUN npm install --only=prod

CMD ["node", "index.js"]
