import { FastifyInstance } from "fastify";
import { makeAuthController } from "../factories/MakeAuthController";

export async function authRoutes(app: FastifyInstance) {
    const controller = makeAuthController();

    app.post('/login', controller.login.bind(controller));
    app.post('/refresh', controller.refresh.bind(controller));
    app.post('/magic-link', controller.requestMagicLink.bind(controller));
}
