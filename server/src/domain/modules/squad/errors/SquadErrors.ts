import { DomainError } from "src/domain/shared/errors/DomainError";

export namespace SquadErrors{
  
    export class invalidName extends DomainError{
        constructor(name: string) {
            super(`The squad name "${name}" is invalid. Must be between 3 and 255 characters.`, 400);
            this.name = "SquadErrors.InvalidName";
        }
    }

    export class invalidCode extends DomainError{
        constructor(code: string) {
            super(`The squad code "${code}" is invalid. Must have only letters(A-Z) and numbers (0-9) and be 6 characters.`, 400);
            this.name = "SquadErrors.InvalidCode";
        }
    }

    export class SquadNotFoundError extends DomainError{
        constructor(code: string) {
            super(`Squad with code ${code} not found.`, 404);
            this.name = "SquadErrors.SquadNotFoundError";
        }
    }
    
}