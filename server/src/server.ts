import 'dotenv/config';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { db } from './shared/infra/database/connection'; 

const app = fastify();

app.register(cors, {
  origin: '*', // TODO: Em produção, restringir para o domínio do frontend
});

app.get('/ping', async () => {
  return { status: 'ok', message: 'Arrival Backend is running! 🚀' };
});

const start = async () => {
  try {
    await db.raw('SELECT 1');
    console.log('📦 Database connected successfully!');

    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('🔥 HTTP Server Running on http://localhost:3333');
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

start();