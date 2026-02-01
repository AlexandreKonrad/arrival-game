import { FastifyReply, FastifyRequest } from "fastify";
import { KnexUserRepository } from "src/infra/database/persistence/knex/KnexUserRepository";
import { magicLinkSchema, loginSchema } from "../../schemas/auth/authSchemas";
import { RequestMagicLinkHandler } from "src/domain/modules/auth/useCases/RequestMagicLinkHandler";
import { LoginHandler } from "src/domain/modules/auth/useCases/LoginHandler";
import { DomainError } from "src/domain/shared/errors/DomainError";
import { AuthErrors } from "src/domain/modules/auth/errors/AuthErrors";
import { TokenTypes } from "src/domain/modules/auth/enums/TokenTypes";
import { TokenExpires } from "src/domain/modules/auth/enums/TokenExpires";

export class AuthController{

    public async requestMagicLink(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        try{
            const { email } = magicLinkSchema.parse(request.body);

            const userRepo = new KnexUserRepository();
            const handler = new RequestMagicLinkHandler(userRepo);

            const { user } = await handler.execute({ email });

            const magicToken = await reply.jwtSign(
                { email: user.email.value, type: TokenTypes.MAGIC },
                { expiresIn: TokenExpires.MIN_15 }
            );

            console.log(`\n🔗 MAGIC LINK: http://localhost:3000/auth/login?token=${magicToken}\n`);

            return reply.status(200).send({ message: "Magic link sent!" });
        } catch(error){
            if (error instanceof DomainError) {
                return reply.status(error.statusCode).send({ message: error.message });
            }
            throw error;
        }
    }

    public async login(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        try{
            const { token } = loginSchema.parse(request.body);
            let decoded: any;
            try {
                decoded = request.server.jwt.verify(token);
            } catch (err) {
                throw new AuthErrors.InvalidToken();
            }

            if(decoded.type !== TokenTypes.MAGIC) throw new AuthErrors.InvalidTokenType();
            
            const userRepo = new KnexUserRepository();
            const handler = new LoginHandler(userRepo);
            
            const { user } = await handler.execute({ emailFromToken: decoded.email });

            const sessionToken = await reply.jwtSign({
                sub: user.id.toString(),
                squadId: user.squadId.toString(),
                role: user.role
            }, {
                sign: { expiresIn: TokenExpires.DAY_30 }
            });

            return reply.status(200).send({
                token: sessionToken,
                user: {
                    name: user.name.value,
                    email: user.email.value,
                    role: user.role
                }
            });

        } catch (error) {
            if (error instanceof DomainError) {
                return reply.status(error.statusCode).send({ message: error.message });
            }
            throw error;
        }
    }
}