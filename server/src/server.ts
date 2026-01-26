import fastify from "fastify";
import cors from '@fastify/cors';
import { ZodError } from "zod";
import { DomainError } from "./domain/shared/errors/DomainError";

import { conn } from "./infra/database/conn";
import { squadRoutes } from "./infra/http/routes/squad.routes";


const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
  test: false,
};

const app = fastify({
  logger: envToLogger['development'],
  ignoreTrailingSlash: true
});

//cors
app.register(cors, {
  origin: '*', // TODO: Em produção, restringir
});

//rotas
app.register(squadRoutes, { prefix: '/squad' });

// health check
app.get('/ping', async () => {
  return { status: 'ok', message: 'Arrival Backend is running! 🚀' };
});

app.setErrorHandler((error, request, reply) => {
  
  if (error instanceof ZodError) {
    return reply.status(400).send({
      status: "validation_error",
      issues: error.format()
    });
  }

  if(error instanceof DomainError){
    request.log.warn({ msg: error.message }, "Domain Rule Violation");
    return reply.status(error.statusCode).send({
      status: "error",
      message: error.message
    });
  }
  
  request.log.error(error, "Critical Error");

  return reply.status(500).send({
    status: "error",
    message: "Internal Server Error"
  });
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log("🚀 Server running on http://localhost:3333");
    
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

const signals = ['SIGINT', 'SIGTERM'];

for (const signal of signals) {
  process.on(signal, async () => {
    app.log.info(`Recebido ${signal}. Iniciando Graceful Shutdown...`);
    
    await app.close();
    await conn.destroy();
    
    app.log.info("Serviço encerrado com sucesso.");
    process.exit(0);
  });
}

start();