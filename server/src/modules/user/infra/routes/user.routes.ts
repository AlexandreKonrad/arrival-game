import { FastifyInstance } from "fastify";
import { authenticate } from "src/shared/infra/http/middlewares/authenticate";
import { makeUserController } from "../factories/makeUserController";

export async function userRoutes(app: FastifyInstance){
    const UserController = makeUserController();

   app.get('/me', { onRequest: [authenticate] }, async (request, reply) => {
        UserController.getProfile(request, reply)
    });
}