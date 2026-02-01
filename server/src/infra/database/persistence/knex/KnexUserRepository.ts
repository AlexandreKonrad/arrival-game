import { conn } from "../../conn";
import { IUserRepository } from "src/domain/modules/user/repositories/IUserRepository";
import { User } from "src/domain/modules/user/entities/User";
import { UserMapper } from "../../mappers/UserMapper";

export class KnexUserRepository implements IUserRepository{
    
    async save(user: User): Promise<void>
    {
        const rawUser = UserMapper.toPersistence(user);

        await conn(
            "user"
        ).insert(
            rawUser
        ).onConflict(
            "id"
        ).merge();
    }

    async exists(email: string): Promise<boolean>
    {
        const result = await conn(
            "user"
        ).select(
            "id"
        ).where(
            "email", email
        ).first();

        return !!result;
    }

    async findByEmail(email: string): Promise<User | null>
    {
        const rawUser = await conn(
            "user"
        ).select(
            "*"
        ).where(
            "email", email
        ).first();

        if(!rawUser) return null;

        return UserMapper.toDomain(rawUser);
    }
}