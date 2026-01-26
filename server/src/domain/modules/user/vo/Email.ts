import { ValueObject } from "src/domain/shared/core/ValueObject";
import { UserErrors } from "../errors/UserErrors";

interface EmailProps{
    value: string;
}

export class Email extends ValueObject<EmailProps>{
    get value(): string{
        return this.props.value;
    }

    private constructor(props: EmailProps){
        super(props);
    }

    public static create(email: string): Email
    {
        const trimmedEmail = email.trim();

        if(!this.isValidEmail(trimmedEmail)) throw new UserErrors.invalidEmail(trimmedEmail);

        return new Email({
            value: trimmedEmail
        });
    }

    private static isValidEmail(email: string): boolean
    {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}