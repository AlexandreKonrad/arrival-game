import { Entity } from "src/shared/core/Entity";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";
import { TokenValue } from "../vo/TokenValue";
import { TokenType } from "../enums/TokenType";

type TokenProps = {
    token: TokenValue;
    type: TokenType;
    userId: UniqueEntityID;
    isUsed: boolean;
    expiresAt: Date;
    createdAt: Date;
};

export class Token extends Entity<TokenProps>
{
    get token(): TokenValue { return this.props.token; }
    get type(): TokenType { return this.props.type }
    get userId(): UniqueEntityID { return this.props.userId }
    get isUsed(): boolean { return this.props.isUsed }
    get expiresAt(): Date { return this.props.expiresAt }
    get createdAt(): Date { return this.props.createdAt }

    private constructor(props: TokenProps, id?: UniqueEntityID){
        super(props, id);
    }

    public isValid(): boolean
    {
        const now = new Date();
        return !this.props.isUsed && this.props.expiresAt > now;
    }

    public markAsUsed(){
        this.props.isUsed = true;
    }

    public static create(props: TokenProps, id?: UniqueEntityID): Token
    {
        return new Token({
            ...props,
            isUsed: props.isUsed ?? false,
            createdAt: props.createdAt ?? new Date()
        }, id);
    }

    public static restore(props: TokenProps, id: UniqueEntityID): Token
    {
        return new Token(props, id);
    }
}