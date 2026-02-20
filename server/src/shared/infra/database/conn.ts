import 'dotenv/config';
import knex from 'knex';
import knexStringcase from "knex-stringcase";
import path from 'path';

const MIGRATIONS_PATH = path.resolve(process.cwd(), 'src', 'shared', 'infra', 'database', 'migrations');

const baseConfig = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: MIGRATIONS_PATH,
    extension: 'ts'
  },
  pool: {
    min: 2,
    max: 10
  },
  // queries lentas
  // debug: process.env.NODE_ENV === 'development',
};

const options = knexStringcase(baseConfig);

export const conn = knex(options);