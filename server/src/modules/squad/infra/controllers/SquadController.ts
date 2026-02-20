import { FastifyReply, FastifyRequest } from "fastify";

import { CreateSquadHandler } from "../../domain/useCases/CreateSquadHandler";
import { JoinSquadHandler } from "../../domain/useCases/JoinSquadHandler";
import { createSquadSchema, joinSquadSchema } from "../schemas/squadSchemas";

import { TokenExpires } from "src/modules/auth/domain/enums/TokenExpires";

import { safe } from "src/shared/utils/safe";
import { UserViewModel } from "src/modules/user/infra/view-models/UserViewModel";
import { SquadViewModel } from "../view-models/SquadViewModel";

export class SquadController{

    constructor(
        private createSquadHandler: CreateSquadHandler,
        private joinSquadHandler: JoinSquadHandler
    ){}
    
    public async createSquadWithOwner(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        const body = createSquadSchema.parse(request.body);

        const [error, result] = await safe(this.createSquadHandler.execute({
            squadName: body.squadName,
            userName: body.userName,
            email: body.userEmail
        }));

        if(error) throw error;
        const { user, squad, refreshToken } = result;

        const accessToken = await reply.jwtSign({
            squadId: user.squadId.toValue(),
            sub: user.id.toValue(),
            role: user.role
        }, {
            sign: { expiresIn: TokenExpires.MIN_15 }
        });

        return reply.status(201).send({
            token: accessToken,
            refreshToken: refreshToken,
            squad: SquadViewModel.toHTTP(squad),
            user: UserViewModel.toHTTP(user)
        });
    }

    public async joinSquad(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        const body = joinSquadSchema.parse(request.body);

       const [error, result] = await safe(this.joinSquadHandler.execute(body));

        if (error) throw error;
        const { user, refreshToken } = result;

        const accessToken = await reply.jwtSign({
            squadId: user.squadId.toValue(),
            sub: user.id.toValue(),
            role: user.role
        }, {
            sign: { expiresIn: TokenExpires.MIN_15 }
        });

        return reply.status(201).send({
            token: accessToken,
            refreshToken: refreshToken,
            user: UserViewModel.toHTTP(user)
        });
    }

}