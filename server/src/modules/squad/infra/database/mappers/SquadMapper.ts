import { Squad } from "src/modules/squad/domain/entities/Squad";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";
import { Name } from "src/modules/squad/domain/vo/Name";
import { SquadCode } from "src/modules/squad/domain/vo/SquadCode";

export class SquadMapper
{
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
            name: Name.create(raw.name),
            code: SquadCode.create(raw.code),
            ownerId: new UniqueEntityID(raw.fkIdOwner),
            createdAt: new Date(raw.createdAt)
        }, new UniqueEntityID(raw.id));
    }
}