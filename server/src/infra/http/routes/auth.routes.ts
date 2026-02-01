import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth/AuthController";

export async function authRoutes(app: FastifyInstance) {
    const controller = new AuthController();

    app.post('/magic-link', controller.requestMagicLink.bind(controller));
    app.post('/login', controller.login.bind(controller));
}
