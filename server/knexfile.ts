import type { Knex } from "knex";
import "dotenv/config"; 

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
    migrations: {
      directory: "./src/infra/database/migrations",
      extension: "ts"
    },
    seeds: {
      directory: "./src/infra/database/seeds"
    },
    useNullAsDefault: true
  },
  test: {
    client: "pg",
    connection: {
      host: process.env.TEST_DB_HOST,
      port: Number(process.env.TEST_DB_PORT),
      user: process.env.TEST_DB_USER, 
      password: process.env.TEST_DB_PASSWORD, 
      database: process.env.TEST_DB_NAME, 
    },
    migrations: {
      directory: "./src/infra/database/migrations",
      extension: "ts"
    },
    useNullAsDefault: true
  }
};

export default config;