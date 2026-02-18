import { FastifyInstance } from "fastify";
import { makeSquadController } from "../factories/makeSquadController";

export async function squadRoutes(app: FastifyInstance){
    const controller = makeSquadController();

    app.post('', controller.createSquadWithOwner.bind(controller));
    app.post('/join', controller.joinSquad.bind(controller));
}