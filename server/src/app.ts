import fastify from "fastify";
import cors from '@fastify/cors';
import  jwt from "@fastify/jwt";
import rateLimit from '@fastify/rate-limit';

import { authenticate } from "./shared/infra/http/middlewares/authenticate";

import { authRoutes } from "./modules/auth/infra/routes/auth.routes";
import { squadRoutes } from "./modules/squad/infra/routes/squad.routes";
import { userRoutes } from "./modules/user/infra/routes/user.routes";

import { ZodError } from "zod";
import { DomainError } from "./shared/errors/DomainError";

export const app = fastify({
  logger: true
});

const secret = process.env.JWT_SECRET;
if(!secret) throw new Error('Missing secrets!');
app.register(jwt, {
  secret: secret
});

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

app.decorate('authenticate', authenticate);

app.addHook('onRequest', (req, reply, done) => {
    reply.raw.setTimeout(10000);
    done();
});

app.register(cors, { origin: process.env.FRONTEND_URL || 'http://localhost:3333' });

/* Rotas */
app.get('/ping', async () => {
  return { status: 'ok', message: 'Arrival Backend is running! 🚀' };
});
app.register(authRoutes, { prefix: '/auth' });
app.register(squadRoutes, { prefix: '/squad' });
app.register(userRoutes, { prefix: '/user' });

/* HANDLE ERRORS */
app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map(issue => {
      const fieldName = issue.path.length > 0 
        ? issue.path.join('.') 
        : 'body';
      return {
        field: fieldName,
        message: issue.message
      }
    });

    return reply.status(400).send({
      status: "validation_error",
      message: "Dados de entrada inválidos.",
      issues: formattedErrors
    });
  }

  if (error instanceof DomainError) {
    return reply.status(error.statusCode).send({
      status: "error",
      message: error.message
    });
  }
  
  request.log.error(error);

  return reply.status(500).send({
    status: "error",
    message: "Internal Server Error"
  });
});
