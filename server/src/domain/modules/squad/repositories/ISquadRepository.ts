import { Squad } from "../entities/Squad";
import { User } from "../../user/entities/User";

export interface ISquadRepository {
    save(squad: Squad): Promise<void>;
    saveWithOwner(squad: Squad, owner: User): Promise<void>;
}