import { DomainError } from "src/shared/errors/DomainError";

export namespace AuthErrors {
    
    export class UserNotFound extends DomainError {
        constructor() {
            super(`User not found.`, 404);
            this.name = "AuthErrors.UserNotFound";
        }
    }

    export class InvalidToken extends DomainError {
        constructor() {
            super("The provided token is invalid.", 401);
            this.name = "AuthErrors.InvalidToken";
        }
    }
}