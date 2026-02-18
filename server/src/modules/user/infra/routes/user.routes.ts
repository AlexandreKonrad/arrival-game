import { FastifyInstance } from "fastify";
import { authenticate } from "src/shared/infra/http/middlewares/authenticate";

export async function userRoutes(app: FastifyInstance){
   app.get('/me', { onRequest: [authenticate] }, async (request, reply) => {
        return reply.send({
            message: "Você está autenticado!",
            user: request.user
        });
    });
}