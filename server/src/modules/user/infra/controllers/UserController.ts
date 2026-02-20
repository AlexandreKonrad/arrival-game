import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserProfileHandler } from "../../domain/useCases/GetUserProfileHandler";
import { safe } from "src/shared/utils/safe";
import { UserViewModel } from "../view-models/UserViewModel";

export class UserController {
    constructor(private getUserProfileHandler: GetUserProfileHandler) {}

    public async getProfile(request: FastifyRequest, reply: FastifyReply) {
        const { sub: userId } = request.user as { sub: string };

        const [error, user] = await safe(this.getUserProfileHandler.execute(userId));

        if(error) throw error;

        return reply.status(200).send({
            user: UserViewModel.toHTTP(user)
        });
    }
}