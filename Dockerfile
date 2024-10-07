FROM node:20.17

WORKDIR /app

COPY . /app

RUN npm install

CMD ["npm", "run", "dev"]