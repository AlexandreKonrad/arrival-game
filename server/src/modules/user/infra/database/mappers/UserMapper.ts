import { User } from "src/modules/user/domain/entities/User";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";
import { Email } from "src/modules/user/domain/vo/Email";
import { Name } from "src/modules/user/domain/vo/Name";
import { UserRole } from "src/modules/user/domain/enums/UserRole";

export class UserMapper{
    public static toPersistence(user: User): any
    {
        return {
            id: user.id.toValue(),
            name: user.name.value,
            email: user.email.value,
            role: user.role,
            fk_id_squad: user.squadId.toValue(),
            created_at: user.createdAt
        };
    }

    public static toDomain(raw: any): User
    {
        return User.restore({
            name: Name.create(raw.name),
            email: Email.create(raw.email),
            squadId: new UniqueEntityID(raw.squadId),
            role: raw.role as UserRole,
            createdAt: new Date(raw.createdAt)
        }, new UniqueEntityID(raw.id));
    }
}