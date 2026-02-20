import { conn } from "../../../../../shared/infra/database/conn";
import { IUserRepository } from "src/modules/user/domain/repositories/IUserRepository";
import { User } from "src/modules/user/domain/entities/User";
import { UserMapper } from "../mappers/UserMapper";
import { Email } from "src/modules/user/domain/vo/Email";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";

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

    async existsByEmail(email: Email): Promise<boolean>
    {
        const result = await conn(
            "user"
        ).select(
            "id"
        ).where(
            "email", email.toValue()
        ).first();

        return !!result;
    }

    async findById(id: UniqueEntityID): Promise<User | null>
    {
        const result = await conn(
            "user"
        ).select(
            "*"
        ).where(
            "id", id.toValue()
        ).first();

        if(!result) return null;

        return UserMapper.toDomain(result);
    }

    async findByEmail(email: Email): Promise<User | null>
    {
        const result = await conn(
            "user"
        ).select(
            "*"
        ).where(
            "email", email.toValue()
        ).first();

        if(!result) return null;

        return UserMapper.toDomain(result);
    }
}