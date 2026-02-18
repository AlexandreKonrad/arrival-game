import { User } from "../entities/User";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";
import { Email } from "../vo/Email";

export interface IUserRepository{
    save(user: User): Promise<void>;
    existsByEmail(email: Email): Promise<boolean>;
    findById(id: UniqueEntityID): Promise<User | null>;
    findByEmail(email: Email): Promise<User | null>;
}