import pg from 'pg';

const { Pool } = pg;

const client = new Pool();

export default client;
