import { Squad } from "src/domain/modules/squad/entities/Squad";

export class SquadMapper{
    public static toPersistence(squad: Squad): any
    {
        return {
            id: squad.id.toString(),
            name: squad.name.value,
            code: squad.code.value,
            fk_id_owner: squad.ownerId.toString(),
            created_at: squad.createdAt
        };
    }

    public static toDomain(raw: any): Squad
    {
        return Squad.restore({
            name: raw.name,
            code: raw.code,
            ownerId: raw.fk_id_owner,
            createdAt: raw.created_at
        }, raw.id);
    }
}