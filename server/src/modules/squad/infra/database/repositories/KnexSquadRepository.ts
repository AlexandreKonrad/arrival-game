import { conn } from "src/shared/infra/database/conn";
import { ISquadRepository } from "src/modules/squad/domain/repositories/ISquadRepository";
import { Squad } from "src/modules/squad/domain/entities/Squad";
import { User } from "src/modules/user/domain/entities/User";
import { SquadMapper } from "../mappers/SquadMapper";
import { SquadCode } from "src/modules/squad/domain/vo/SquadCode";
import { UserMapper } from "src/modules/user/infra/database/mappers/UserMapper";

export class KnexSquadRepository implements ISquadRepository{

    async findByCode(code: SquadCode): Promise<Squad | null>
    {
        const rawSquad = await conn(
            "squad"
        ).where({
            code: code.toValue()
        }).first();

        if (!rawSquad) return null;
        
        return SquadMapper.toDomain(rawSquad);
    }

    async saveWithOwner(squad: Squad, owner: User): Promise<void>
    {
        const rawSquad = SquadMapper.toPersistence(squad);
        const rawUser = UserMapper.toPersistence(owner);

        await conn.transaction(async (trx) => {
            await trx("squad").insert({
                ...rawSquad,
                fk_id_owner: null
            });

            await trx("user").insert(rawUser);

            await trx(
                "squad"
            ).where({
                id: rawSquad.id
            }).update({
                fk_id_owner: rawUser.id
            });
        });
    }
}