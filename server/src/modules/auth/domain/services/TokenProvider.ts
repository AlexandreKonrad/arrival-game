import { randomUUID } from "node:crypto";
import { ITokenRepository } from "../repositories/ITokenRepository";
import { Token } from "../entities/Token";
import { TokenValue } from "../vo/TokenValue";
import { TokenType } from "../enums/TokenType";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";
import { TokenExpires } from "../enums/TokenExpires";

export class TokenProvider{
    constructor(
        private tokenRepository: ITokenRepository
    ){}

    public async generateRefreshToken(userId: UniqueEntityID): Promise<string>
    {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + parseInt(TokenExpires.DAY_30));

        const tokenStr = await this.generateToken(userId, TokenType.REFRESH, expiresAt);

        return tokenStr;
    }

    public async generateMagicLinkToken(userId: UniqueEntityID): Promise<string>
    {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(TokenExpires.MIN_15));

        const tokenStr = await this.generateToken(userId, TokenType.MAGIC, expiresAt);
        
        return tokenStr;
    }

    private async generateToken(userId: UniqueEntityID, type: TokenType, expiresAt: Date): Promise<string>
    {
        const tokenStr = randomUUID();
        const tokenVO = TokenValue.create(tokenStr);

        const token = Token.create({
            token: tokenVO,
            type: type,
            userId: userId,
            isUsed: false,
            expiresAt: expiresAt,
            createdAt: new Date()
        });
        await this.tokenRepository.save(token);

        return tokenStr;
    }
}