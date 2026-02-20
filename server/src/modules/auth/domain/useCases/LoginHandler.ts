import { IUserRepository } from "src/modules/user/domain/repositories/IUserRepository"; 
import { User } from "src/modules/user/domain/entities/User";
import { ITokenRepository } from "../repositories/ITokenRepository";
import { TokenProvider } from "../services/TokenProvider";
import { TokenValue } from "../vo/TokenValue";
import { AuthErrors } from "../errors/AuthErrors";

type LoginInput = {
    tokenStr: string;
}

type LoginOutput = {
    user: User;
    refreshToken: string
}

export class LoginHandler{
    constructor(
        private tokenRepository: ITokenRepository,
        private userRepository: IUserRepository,
        private tokenProvider: TokenProvider
    ) {}

    public async execute({ tokenStr }: LoginInput): Promise<LoginOutput>
    {
        const tokenVO = TokenValue.create(tokenStr);
        const token = await this.tokenRepository.findByToken(tokenVO);
        if(!token || !token.isValid()) throw new AuthErrors.InvalidToken();

        const user = await this.userRepository.findById(token.userId);
        if(!user) throw new AuthErrors.UserNotFound();

        await this.tokenRepository.markAsUsed(tokenVO);

        const refreshTokenStr = await this.tokenProvider.generateRefreshToken(user.id);

        return { 
            user, 
            refreshToken: refreshTokenStr 
        };
    }
}