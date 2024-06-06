import pg from 'pg';

const { Pool } = pg;

const client = new Pool({
  database: process.env.PGDATABASE,
});

export default client;
