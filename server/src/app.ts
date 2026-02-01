import fastify from "fastify";
import cors from '@fastify/cors';
import { ZodError } from "zod";
import { DomainError } from "./domain/shared/errors/DomainError";
import { squadRoutes } from "./infra/http/routes/squad.routes";

export const app = fastify({
  logger: true
});
app.register(cors, { origin: '*' });

app.register(squadRoutes, { prefix: '/squad' });

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