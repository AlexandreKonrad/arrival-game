import { ValueObject } from "src/shared/core/ValueObject";
import { AuthErrors } from "../errors/AuthErrors";
import { validate as uuidValidate } from 'uuid';

interface TokenValueProps{
    value: string;
}

export class TokenValue extends ValueObject<TokenValueProps>
{
    get value(): string { return this.props.value }

    private constructor(props: TokenValueProps){
        super(props);
    }

    public static create(token: string): TokenValue
    {
        if(!this.isValidUUID(token)) throw new AuthErrors.InvalidToken();

        return new TokenValue({ value: token });
    }

    private static isValidUUID(token: string): boolean
    {
        return uuidValidate(token);
    }
}