import { ValueObject } from "src/shared/core/ValueObject";
import { UserErrors } from "../errors/UserErrors";

interface EmailProps{
    value: string;
}

export class Email extends ValueObject<EmailProps>
{
    get value(): string{
        return this.props.value;
    }

    private constructor(props: EmailProps){
        super(props);
    }

    public static create(email: string): Email
    {
        const trimmedEmail = email.trim();

        if(!this.isValidEmail(trimmedEmail)) throw new UserErrors.invalidEmail();

        return new Email({
            value: trimmedEmail
        });
    }

    public static isValidEmail(email: string): boolean
    {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}