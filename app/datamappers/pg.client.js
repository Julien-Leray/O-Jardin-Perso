import pg from 'pg';

const { Pool } = pg;

const client = new Pool({
  database: 'ojardin',
});

export default client;
