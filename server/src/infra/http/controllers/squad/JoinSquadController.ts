import { FastifyReply, FastifyRequest } from "fastify";
import { joinSquadSchema } from "../../schemas/squad/joinSquadSchema";
import { KnexSquadRepository } from "src/infra/database/persistence/knex/KnexSquadRepository";
import { KnexUserRepository } from "src/infra/database/persistence/knex/KnexUserRepository";
import { JoinSquadHandler } from "src/domain/modules/squad/useCases/JoinSquadHandler";
import { UserRole } from "src/domain/modules/user/enums/UserRole";
import { TokenExpires } from "src/domain/modules/auth/enums/TokenExpires";

export class JoinSquadController {
    
    public async handle(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        const body = joinSquadSchema.parse(request.body);

        const squadRepo = new KnexSquadRepository();
        const userRepo = new KnexUserRepository();
        const handler = new JoinSquadHandler(squadRepo, userRepo);

        const result = await handler.execute({
            userName: body.userName,
            userEmail: body.userEmail,
            squadCode: body.squadCode
        });

        const token = await reply.jwtSign({
            sub: result.userId,
            squadId: result.squadId,
            role: UserRole.MEMBER
        },{
            sign: { expiresIn: TokenExpires.DAY_30 }
        });

        return reply.status(201).send({
            ...result,
            token
        });
    }
}