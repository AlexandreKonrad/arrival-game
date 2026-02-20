import { DomainError } from "src/shared/errors/DomainError";

export namespace UserErrors{
  
    export class invalidName extends DomainError
    {
        constructor(){
            super(`User name is invalid. Must be between 4 and 255 characters and only letters.`, 400);
            this.name = "UserErrors.InvalidName";
        }
    }

    export class invalidEmail extends DomainError
    {
        constructor(){
            super(`User email is invalid.`, 400);
            this.name = "UserErrors.invalidEmail";
        }
    }

    export class EmailAlreadyExists extends DomainError
    {
        constructor(){
            super(`User email already exists.`, 409);
            this.name = "UserErrors.EmailAlreadyExists";
        }
    }

    export class NotFound extends DomainError
    {
        constructor(){
            super(`User not found.`, 404);
            this.name = "UserErrors.UserNotFoundError";
        }
    }
}