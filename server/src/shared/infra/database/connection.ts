import 'dotenv/config';
import knex, { Knex } from 'knex';

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL environment variable is not set.');
}

export const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  useNullAsDefault: true,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './migrations',
    extension: 'ts'
  }
};

export const db = knex(config);