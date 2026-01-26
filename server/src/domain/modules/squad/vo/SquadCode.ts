import { ValueObject } from "src/domain/shared/core/ValueObject";
import { SquadErrors } from "../errors/SquadErrors";

interface SquadCodeProps{
    value: string
}

export class SquadCode extends ValueObject<SquadCodeProps>{
    get value(): string { return this.props.value }

    private constructor(props: SquadCodeProps){
        super(props);
    }

    public static create(code: string): SquadCode
    {
        if(!this.isValidCode(code)) throw new SquadErrors.invalidCode(code);

        return new SquadCode({
            value: code
        });
    }

    public static generate(): SquadCode {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return new SquadCode({ value: code });
    }

    private static isValidCode(code: string): boolean
    {
        const re = /^[A-Z0-9]{6}$/;
        return re.test(code);
    }
}