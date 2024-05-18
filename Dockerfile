
FROM node:20.12.2

WORKDIR /usr/src/app

COPY package.json ./package.json

ENV PORT=4000
ENV PGDATABASE=ojardin

RUN npm install

COPY . .


EXPOSE 4000

CMD ["node", "index.js"]