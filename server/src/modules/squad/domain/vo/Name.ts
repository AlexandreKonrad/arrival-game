import { ValueObject } from "src/shared/core/ValueObject";
import { SquadErrors } from "../errors/SquadErrors";

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

        if(!this.isValidName(trimmedName)) throw new SquadErrors.invalidName();

        return new Name({
            value: trimmedName
        });
    }

    private static isValidName(name: string): boolean
    {
        if (name.length < 3 || name.length > 255) return false

        return true;
    }
}