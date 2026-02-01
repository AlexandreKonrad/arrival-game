import { FastifyReply, FastifyRequest } from "fastify";
import { CreateSquadHandler } from "src/domain/modules/squad/useCases/CreateSquadHandler";
import { KnexSquadRepository } from "src/infra/database/persistence/knex/KnexSquadRepository";
import { KnexUserRepository } from "src/infra/database/persistence/knex/KnexUserRepository";
import { createSquadSchema } from "../../schemas/squad/createSquadSchema";
import { UserRole } from "src/domain/modules/user/enums/UserRole";
import { TokenExpires } from "src/domain/modules/auth/enums/TokenExpires";

export class CreateSquadController{
    
    public async handle(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        const body = createSquadSchema.parse(request.body);

        const squadRepository = new KnexSquadRepository();
        const userRepository = new KnexUserRepository();
        const handler = new CreateSquadHandler(squadRepository, userRepository);

        const result = await handler.execute({
            squadName: body.squadName,
            userName: body.userName,
            email: body.userEmail
        });

        const token = await reply.jwtSign({
            sub: result.userId,
            squadId: result.squadId,
            role: UserRole.OWNER
        },{
            sign: { expiresIn: TokenExpires.DAY_30 }
        });

        return reply.status(201).send({
            ...result,
            token
        });
    }

}