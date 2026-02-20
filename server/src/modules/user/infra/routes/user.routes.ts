import { FastifyInstance } from "fastify";
import { authenticate } from "src/shared/infra/http/middlewares/authenticate";
import { makeUserController } from "../factories/makeUserController";

export async function userRoutes(app: FastifyInstance){
    const controller = makeUserController();

   app.get('/me', { onRequest: [authenticate] }, controller.getProfile.bind(controller))
}