import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.test');
console.log(`Carregando variáveis de: ${envPath}`);

const result = dotenv.config({ path: envPath });
if(result.error){
  console.warn('Aviso: Não foi possível ler o arquivo .env.test (Pode ser que você esteja usando variáveis de ambiente do sistema)');
}

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

if (!DB_NAME || !DB_USER || !DB_PASS) {
  console.error('Erro: Variáveis de banco não encontradas no .env.test');
  process.exit(1);
}

if (DB_NAME === process.env.DB_NAME_PROD) {
  console.error('PERIGO: Você está tentando rodar testes no banco de produção!');
  process.exit(1);
}

async function resetTestDb() {
  console.log(`Iniciando reset do banco de testes: ${DB_NAME}...`);
  const client = new Client({
    user: DB_USER,
    password: DB_PASS,
    host: DB_HOST,
    port: Number(DB_PORT),
    database: 'postgres'
  });

  try {
    await client.connect();

    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid();
    `);

    await client.query(`DROP DATABASE IF EXISTS "${DB_NAME}";`);
    console.log(`Banco antigo removido.`);
      
    await client.query(`CREATE DATABASE "${DB_NAME}";`);
    console.log(`Banco novo criado: ${DB_NAME}`);
  } catch (err) {
    console.error('Falha ao resetar banco de testes:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetTestDb();