import { conn } from "src/shared/infra/database/conn";
import { ISquadRepository } from "src/modules/squad/domain/repositories/ISquadRepository";
import { Squad } from "src/modules/squad/domain/entities/Squad";
import { User } from "src/modules/user/domain/entities/User";
import { SquadMapper } from "../mappers/SquadMapper";
import { SquadCode } from "src/modules/squad/domain/vo/SquadCode";

export class KnexSquadRepository implements ISquadRepository{

    async findByCode(code: SquadCode): Promise<Squad | null>
    {
        const rawSquad = await conn(
            "squad"
        ).where({
            code: code.value
        }).first();

        if (!rawSquad) return null;
        
        return SquadMapper.toDomain(rawSquad);
    }

    async saveWithOwner(squad: Squad, owner: User): Promise<void>
    {
        const rawSquad = SquadMapper.toPersistence(squad);

        const rawUser = {
            id: owner.id.toString(),
            name: owner.name.value,
            email: owner.email.value,
            role: owner.role,
            fk_id_squad: owner.squadId.toString(),
            created_at: new Date(),
            updated_at: new Date()
        };

        await conn.transaction(async (trx) => {
            const squadInsertion = { ...rawSquad, fk_id_owner: null };
            await trx("squad").insert(squadInsertion);

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