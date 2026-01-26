import 'dotenv/config';
import knex, { Knex } from 'knex';
import knexStringcase from "knex-stringcase";

if (!process.env.DATABASE_URL) {
  throw new Error('❌ DATABASE_URL environment variable is not set.');
}

const baseConfig: Knex.Config = {
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
const options = knexStringcase(baseConfig as any);

export const conn = knex(options);