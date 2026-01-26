import { ValueObject } from "src/domain/shared/core/ValueObject";
import { UserErrors } from "../errors/UserErrors";

interface NameProps{
    value: string;
}

export class Name extends ValueObject<NameProps>{
    get value(): string{
        return this.props.value;
    }

    private constructor(props: NameProps){
        super(props);
    }

    public static create(name: string): Name
    {
        const trimmedName = name.trim();

        if(!this.isValidName(trimmedName)) throw new UserErrors.invalidName(trimmedName);

        return new Name({
            value: trimmedName
        });
    }

    private static isValidName(name: string): boolean
    {
        if (name.length < 4 || name.length > 255) return false

        return true;
    }
}