import type { Knex } from "knex";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const envFile = env === 'test' ? '.env.test' : '.env';
const envPath = path.resolve(__dirname, envFile);
dotenv.config({ path: envPath });

console.log(`\nKnex Environment: ${env}`);
console.log(`Configuration loaded from: ${envFile}`);

const MIGRATIONS_DIR = path.resolve(__dirname, "src", "shared", "infra", "database", "migrations");
const SEEDS_DIR = path.resolve(__dirname, "src", "shared", "infra", "database", "seeds");

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER, 
      password: process.env.DB_PASSWORD, 
      database: process.env.DB_NAME, 
    },
    migrations: { directory: MIGRATIONS_DIR, extension: "ts" },
    seeds: { directory: SEEDS_DIR },
    useNullAsDefault: true
  },

  test: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER, 
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME, 
    },
    migrations: { directory: MIGRATIONS_DIR, extension: "ts" },
    pool: { min: 2, max: 10 },
    useNullAsDefault: true
  }
};

export default config;