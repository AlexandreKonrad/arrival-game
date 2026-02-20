import { FastifyReply, FastifyRequest } from "fastify";
import { RequestMagicLinkHandler } from "../../domain/useCases/RequestMagicLinkHandler";
import { LoginHandler } from "../../domain/useCases/LoginHandler";
import { RefreshTokenHandler } from "../../domain/useCases/RefreshTokenHandler";
import { loginSchema, refreshTokenSchema, magicLinkSchema } from "../schemas/authSchemas";
import { TokenExpires } from "../../domain/enums/TokenExpires";
import { safe } from "src/shared/utils/safe";
import { UserViewModel } from "src/modules/user/infra/view-models/UserViewModel";

export class AuthController{

    constructor(
        private requestMagicLinkHandler: RequestMagicLinkHandler,
        private loginHandler: LoginHandler,
        private refreshTokenHandler: RefreshTokenHandler
    ){}

    public async login(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        const { token } = loginSchema.parse(request.body);
        const [ error, result ] = await safe(this.loginHandler.execute({ tokenStr: token }));

        if(error) throw error;
        const { user, refreshToken } = result;

        const accessToken = await reply.jwtSign({
            squadId: user.squadId.toValue(),
            sub: user.id.toValue(),
            role: user.role
        },{
            sign: { expiresIn: TokenExpires.MIN_15 }
        });

        return reply.status(200).send({
            token: accessToken,
            refreshToken: refreshToken,
            user: UserViewModel.toHTTP(user)
        });
    }

    public async refresh(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        const { refreshToken } = refreshTokenSchema.parse(request.body);
        const [ error, result ] = await safe(this.refreshTokenHandler.execute({ refreshToken }));

        if(error) throw error;
        const { user, newRefreshToken } = result;

        const newAccessToken = await reply.jwtSign({
            sub: user.id.toValue(),
            squadId: user.squadId.toValue(),
            role: user.role
        },{
            sign: { expiresIn: TokenExpires.MIN_15 }
        });

        return reply.status(200).send({
            token: newAccessToken,
            refreshToken: newRefreshToken,
            user: UserViewModel.toHTTP(user)
        })
    }

    public async requestMagicLink(request: FastifyRequest, reply: FastifyReply): Promise<void>
    {
        const { email } = magicLinkSchema.parse(request.body);
        const [ error, token ] = await safe(this.requestMagicLinkHandler.execute({ email }));

        if(error) throw error;

        const magicLink = `http://localhost:3000/auth/login?token=${token}`;
        console.log(`\n🔗 MAGIC LINK: ${magicLink}\n`);

        return reply.status(200).send({ message: "Magic link sent!" });
    }    
}