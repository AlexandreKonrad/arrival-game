import { FastifyInstance } from "fastify";
import { CreateSquadController } from "../controllers/squad/CreateSquadController"; 

export async function squadRoutes(app: FastifyInstance){
    const createSquadController = new CreateSquadController();

    app.post("", async(request, reply) => {
        return createSquadController.handle(request, reply);
    });
}