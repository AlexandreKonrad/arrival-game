import { FastifyReply, FastifyRequest } from "fastify";
import { CreateSquadHandler } from "src/domain/modules/squad/commands/CreateSquadHandler";
import { KnexSquadRepository } from "src/infra/database/persistence/knex/KnexSquadRepository";
import { createSquadSchema } from "../../schemas/squad/createSquadSchema";

export class CreateSquadController{
    
    public async handle(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        const body = createSquadSchema.parse(request.body);

        const repository = new KnexSquadRepository();
        const handler = new CreateSquadHandler(repository);

        const squadId = await handler.execute({
            squadName: body.squadName,
            userName: body.userName,
            email: body.userEmail
        });

        return reply.status(201).send({id: squadId });
    }

}