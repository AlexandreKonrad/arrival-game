import { Token } from "../entities/Token";
import { TokenValue } from "../vo/TokenValue";

export interface ITokenRepository
{
    save(token: Token): Promise<void>;
    findByToken(token: TokenValue): Promise<Token | null>;
    markAsUsed(tokenId: string): Promise<void>;
}