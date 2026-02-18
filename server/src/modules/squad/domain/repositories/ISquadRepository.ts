import { Squad } from "../entities/Squad";
import { User } from "../../../user/domain/entities/User";
import { SquadCode } from "../vo/SquadCode";

export interface ISquadRepository {
    findByCode(code: SquadCode): Promise<Squad | null>;
    saveWithOwner(squad: Squad, owner: User): Promise<void>;
}