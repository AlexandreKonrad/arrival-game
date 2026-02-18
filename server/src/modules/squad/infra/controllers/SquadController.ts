import { FastifyReply, FastifyRequest } from "fastify";

import { CreateSquadHandler } from "../../domain/useCases/CreateSquadHandler";
import { JoinSquadHandler } from "../../domain/useCases/JoinSquadHandler";
import { createSquadSchema, joinSquadSchema } from "../schemas/squadSchemas";

import { TokenExpires } from "src/modules/auth/domain/enums/TokenExpires";

export class SquadController{

    constructor(
        private createSquadHandler: CreateSquadHandler,
        private joinSquadHandler: JoinSquadHandler
    ){}
    
    public async createSquadWithOwner(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        const body = createSquadSchema.parse(request.body);

        const { user, refreshToken, squadCode } = await this.createSquadHandler.execute({
            squadName: body.squadName,
            userName: body.userName,
            email: body.userEmail
        });

        const accessToken = await reply.jwtSign({
            squadId: user.squadId.toString(),
            sub: user.id.toString(),
            role: user.role
        }, {
            sign: { expiresIn: TokenExpires.MIN_15 }
        });

        return reply.status(201).send({
            token: accessToken,
            refreshToken: refreshToken,
            squadCode: squadCode.value.toString(),
            user: {
                squadId: user.squadId.toString(),
                id: user.id.toString(),
                name: user.name.value,
                email: user.email.value,
                role: user.role
            }
        });
    }

    public async joinSquad(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        const body = joinSquadSchema.parse(request.body);

        const { user, refreshToken } = await this.joinSquadHandler.execute(body);

        const accessToken = await reply.jwtSign({
            squadId: user.squadId.toString(),
            sub: user.id.toString(),
            role: user.role
        }, {
            sign: { expiresIn: TokenExpires.MIN_15 }
        });

        return reply.status(201).send({
            token: accessToken,
            refreshToken: refreshToken,
            user: {
                squadId: user.squadId.toString(),
                id: user.id.toString(),
                name: user.name.value,
                email: user.email.value,
                role: user.role
            }
        });
    }

}