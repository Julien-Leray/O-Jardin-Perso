
FROM node:20.12.2

RUN apt-get update && apt-get install -y postgresql-client \
    && curl -L https://cpanmin.us | perl - App::cpanminus \
    && cpanm --quiet --notest App::Sqitch \
    && cpanm --quiet --notest DBD::Pg

WORKDIR /usr/src/app

COPY package.json ./package.json

ENV PORT=4000
ENV PGDATABASE=ojardin
ENV PGPASSWORD=ojardin

RUN npm install

COPY . .

COPY sqitch.conf /usr/src/app/sqitch.conf

RUN psql -d "ojardin" -f data/seeding_v1.sql

EXPOSE 4000

CMD ["sh", "-c", "sqitch deploy && node index.js"]