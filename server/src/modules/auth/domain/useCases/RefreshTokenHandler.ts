import { IUserRepository } from "src/modules/user/domain/repositories/IUserRepository";
import { ITokenRepository } from "../repositories/ITokenRepository";
import { TokenProvider } from "../services/TokenProvider";
import { User } from "src/modules/user/domain/entities/User";
import { AuthErrors } from "../errors/AuthErrors";
import { TokenValue } from "../vo/TokenValue";

type RefreshInput = {
    refreshToken: string;
}

type RefreshOutput = {
    user: User;
    newRefreshToken: string;
}

export class RefreshTokenHandler{
    constructor(
        private tokenRepository: ITokenRepository,
        private userRepository: IUserRepository,
        private tokenProvider: TokenProvider
    ){}

    public async execute({ refreshToken }: RefreshInput): Promise<RefreshOutput> {
        
        const tokenVO = TokenValue.create(refreshToken);
        const token = await this.tokenRepository.findByToken(tokenVO);
        if (!token || !token.isValid()) throw new AuthErrors.InvalidToken();

        const user = await this.userRepository.findById(token.userId);
        if (!user) throw new AuthErrors.UserNotFound();

        await this.tokenRepository.markAsUsed(tokenVO);
       
        const newRefreshTokenStr = await this.tokenProvider.generateRefreshToken(user.id);

        return {
            user,
            newRefreshToken: newRefreshTokenStr
        };
    }
}