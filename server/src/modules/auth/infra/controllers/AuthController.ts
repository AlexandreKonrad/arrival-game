import { FastifyReply, FastifyRequest } from "fastify";
import { RequestMagicLinkHandler } from "../../domain/useCases/RequestMagicLinkHandler";
import { LoginHandler } from "../../domain/useCases/LoginHandler";
import { RefreshTokenHandler } from "../../domain/useCases/RefreshTokenHandler";
import { loginSchema, refreshTokenSchema, magicLinkSchema } from "../schemas/authSchemas";
import { DomainError } from "src/shared/errors/DomainError";
import { TokenExpires } from "../../domain/enums/TokenExpires";

export class AuthController{

    constructor(
        private requestMagicLinkHandler: RequestMagicLinkHandler,
        private loginHandler: LoginHandler,
        private refreshTokenHandler: RefreshTokenHandler
    ){}

    public async login(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        try{
            const { token } = loginSchema.parse(request.body);
            const { user, refreshToken } = await this.loginHandler.execute({ tokenStr: token });

            const accessToken = await reply.jwtSign({
                squadId: user.squadId.toString(),
                sub: user.id.toString(),
                role: user.role
            },{
                sign: { expiresIn: TokenExpires.MIN_15 }
            });

            return reply.status(200).send({
                token: accessToken,
                refreshToken: refreshToken,
                user: {
                    id: user.id,
                    name: user.name.value,
                    email: user.email.value,
                    role: user.role
                }
            });

        } catch(error){
            if(error instanceof DomainError){
                return reply.status(error.statusCode).send({ message: error.message });
            }
            throw error;
        }
    }

    public async refresh(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        try{
            const { refreshToken } = refreshTokenSchema.parse(request.body);
            const { user, newRefreshToken } = await this.refreshTokenHandler.execute({ refreshToken });

            const newAccessToken = await reply.jwtSign({
                sub: user.id.toString(),
                squadId: user.squadId.toString(),
                role: user.role
            },{
                sign: { expiresIn: TokenExpires.MIN_15 }
            });

            return reply.status(200).send({
                token: newAccessToken,
                refreshToken: newRefreshToken
            })
        } catch(error){
            if(error instanceof DomainError){
                return reply.status(error.statusCode).send({ message: error.message });
            }
            throw error;
        }
    }

    public async requestMagicLink(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        try{
            const { email } = magicLinkSchema.parse(request.body);
            const { token } = await this.requestMagicLinkHandler.execute({ email });

            const magicLink = `http://localhost:3000/auth/login?token=${token}`;
            console.log(`\n🔗 MAGIC LINK: ${magicLink}\n`);

            return reply.status(200).send({ message: "Magic link sent!" });
        } catch(error){
            if (error instanceof DomainError) {
                return reply.status(error.statusCode).send({ message: error.message });
            }
            throw error;
        }
    }    
}