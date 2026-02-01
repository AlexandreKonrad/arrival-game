import { FastifyInstance } from "fastify";
import { CreateSquadController } from "../controllers/squad/CreateSquadController";
import { JoinSquadController } from "../controllers/squad/JoinSquadController";

export async function squadRoutes(app: FastifyInstance){
    const createSquadController = new CreateSquadController();
    const joinSquadController = new JoinSquadController();

    app.post("", async(request, reply) => {
        return createSquadController.handle(request, reply);
    });

    app.post("/join", async(request, reply) => {
        return joinSquadController.handle(request, reply);
    });
}