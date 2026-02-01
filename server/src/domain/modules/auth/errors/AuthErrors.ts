import { DomainError } from "src/domain/shared/errors/DomainError";

export namespace AuthErrors {
    
    export class UserNotFound extends DomainError {
        constructor(email: string) {
            super(`User with email "${email}" not found.`, 404);
            this.name = "AuthErrors.UserNotFound";
        }
    }

    export class InvalidToken extends DomainError {
        constructor() {
            super("The provided token is invalid or expired.", 401);
            this.name = "AuthErrors.InvalidToken";
        }
    }

    export class InvalidTokenType extends DomainError {
        constructor() {
            super("The provided token type is invalid.", 401);
            this.name = "AuthErrors.InvalidTokenType";
        }
    }
}