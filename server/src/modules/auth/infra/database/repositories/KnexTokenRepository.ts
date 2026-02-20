import { conn } from "src/shared/infra/database/conn";
import { ITokenRepository } from "src/modules/auth/domain/repositories/ITokenRepository";
import { Token } from "src/modules/auth/domain/entities/Token";
import { TokenMapper } from "../mappers/TokenMapper";
import { TokenValue } from "src/modules/auth/domain/vo/TokenValue";

export class KnexTokenRepository implements ITokenRepository
{
    async save(token: Token): Promise<void>
    {
        const rawToken = TokenMapper.toPersistence(token);

        await conn(
            "token"
        ).insert(
            rawToken
        ).onConflict(
            "id"
        ).merge();
    }

    async findByToken(token: TokenValue): Promise<Token | null>
    {
        const result = await conn(
            "token"
        ).where(
            "token", token.toValue()
        ).first();

        if(!result) return null;

        return TokenMapper.toDomain(result);
    }

    async markAsUsed(token: TokenValue): Promise<void>
    {
        await conn(
            "token"
        ).where(
            "id", token.toValue()
        ).update({
            is_used: true
        })
    }
}