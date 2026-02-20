import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserProfileHandler } from "../../domain/useCases/GetUserProfileHandler";

export class UserController {
    constructor(private getUserProfileHandler: GetUserProfileHandler) {}

    public async getProfile(request: FastifyRequest, reply: FastifyReply) {
        const { sub: userId } = request.user as { sub: string };

        const user = await this.getUserProfileHandler.execute(userId);

        return reply.status(200).send({
            user
        });
    }
}