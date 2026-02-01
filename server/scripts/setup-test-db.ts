import { Client } from 'pg';
import 'dotenv/config';

async function setupTestDb() {
  const dbConfig = {
    connectionString: process.env.DATABASE_URL
  };

  const client = new Client({
    user: 'admin',
    password: 'password123',
    host: 'localhost',
    port: 5432,
    database: 'postgres'
  });

  try {
    await client.connect();
    
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'arrival_test'"
    );

    if (res.rowCount === 0) {
      console.log('⚡ Criando banco de dados arrival_test...');
      await client.query('CREATE DATABASE arrival_test');
      console.log('✅ Banco arrival_test criado com sucesso!');
    } else {
      console.log('ℹ️ Banco arrival_test já existe.');
    }

  } catch (err) {
    console.error('❌ Erro ao configurar banco de teste:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupTestDb();