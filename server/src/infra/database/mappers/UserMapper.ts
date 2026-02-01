import { User } from "src/domain/modules/user/entities/User";

export class UserMapper{
    public static toPersistence(user: User): any
    {
        return {
            id: user.id.toString(),
            name: user.name.value,
            email: user.email.value,
            role: user.role,
            fk_id_squad: user.squadId.toString(),
            created_at: user.createdAt
        };
    }

    public static toDomain(raw: any): User
    {
        console.log("🛠️ DEBUG RAW USER:", raw);

        return User.restore({
            name: raw.name,
            email: raw.email,
            role: raw.role,
            squadId: raw.fkIdSquad,
            createdAt: raw.createdAt
        }, raw.id);
    }
}