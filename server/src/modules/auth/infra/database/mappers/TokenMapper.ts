import { Token } from "src/modules/auth/domain/entities/Token";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";
import { TokenValue } from "src/modules/auth/domain/vo/TokenValue";
import { TokenType } from "src/modules/auth/domain/enums/TokenType";

export class TokenMapper
{
    public static toPersistence(token: Token): any
    {
        return {
            id: token.id.toString(),
            token: token.token.value,
            type: token.type,
            fk_id_user: token.userId.toString(),
            is_used: token.isUsed,
            expires_at: token.expiresAt,
            created_at: token.createdAt
        }
    }

    public static toDomain(raw: any): Token
    {
        return Token.restore({
            token: TokenValue.create(raw.token),
            type: raw.type as TokenType,
            userId: new UniqueEntityID(raw.userId),
            isUsed: Boolean(raw.isUsed),
            expiresAt: new Date(raw.expiresAt),
            createdAt: new Date(raw.createdAt)
        }, new UniqueEntityID(raw.id));
    }
}