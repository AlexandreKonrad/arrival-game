import { Squad } from "../entities/Squad";
import { User } from "../../user/entities/User";

export interface ISquadRepository {
    findByCode(code: string): Promise<Squad | null>;
    save(squad: Squad): Promise<void>;
    saveWithOwner(squad: Squad, owner: User): Promise<void>;
}