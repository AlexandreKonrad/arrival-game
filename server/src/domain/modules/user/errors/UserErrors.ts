import { DomainError } from "src/domain/shared/errors/DomainError";

export namespace UserErrors{
  
    export class invalidName extends DomainError{
        constructor(name: string) {
            super(`The user name "${name}" is invalid. Must be between 4 and 255 characters and only letters.`, 400);
            this.name = "UserErrors.InvalidName";
        }
    }

    export class invalidEmail extends DomainError{
        constructor(email: string) {
            super(`The user email "${email}" is invalid.`, 400);
            this.name = "UserErrors.invalidEmail";
        }
    }

    export class EmailAlreadyExists extends DomainError {
        constructor(email: string) {
        super(`The email "${email}" is already associated with an account.`, 409);
        this.name = "UserErrors.EmailAlreadyExists";
        }
    } 
}