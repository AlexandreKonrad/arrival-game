import { DomainError } from "src/shared/errors/DomainError";

export namespace SquadErrors{
  
    export class invalidName extends DomainError
    {
        constructor(){
            super(`The squad name is invalid.`, 400);
            this.name = "SquadErrors.InvalidName";
        }
    }

    export class invalidCode extends DomainError
    {
        constructor(){
            super(`The squad code is invalid.`, 400);
            this.name = "SquadErrors.InvalidCode";
        }
    }

    export class NotFound extends DomainError
    {
        constructor(){
            super(`Squad not found.`, 404);
            this.name = "SquadErrors.SquadNotFoundError";
        }
    }
    
}