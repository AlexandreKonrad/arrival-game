import { conn } from "../../conn";
import { ISquadRepository } from "src/domain/modules/squad/repositories/ISquadRepository";
import { Squad } from "src/domain/modules/squad/entities/Squad";
import { User } from "src/domain/modules/user/entities/User";
import { SquadMapper } from "../../mappers/SquadMapper";

export class KnexSquadRepository implements ISquadRepository{

    async findByCode(code: string): Promise<Squad | null>
    {
        const rawSquad = await conn("squad").where({ code }).first();

        if (!rawSquad) return null;
        
        return SquadMapper.toDomain(rawSquad);
    }
    
    async save(squad: Squad): Promise<void>
    {
        const rawSquad = SquadMapper.toPersistence(squad);

        await conn(
            "squad"
        ).insert(
            rawSquad
        ).onConflict(
            "id"
        ).merge();
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