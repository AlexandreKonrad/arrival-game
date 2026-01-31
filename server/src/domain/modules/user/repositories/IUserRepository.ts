import { User } from "../entities/User";

export interface IUserRepository{
    save(user: User): Promise<void>;
    exists(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<User | null>;
}