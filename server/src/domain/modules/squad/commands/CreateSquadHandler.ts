import { UniqueEntityID } from "src/domain/shared/core/UniqueEntityID";
import { Squad } from "../entities/Squad";
import { User } from "../../user/entities/User";
import { UserRole } from "../../user/enums/UserRole";
import { ISquadRepository } from "../repositories/ISquadRepository";
import { CreateSquadCommand } from "./CreateSquadCommand";
import { Email } from "../../user/vo/Email";
import { Name as SquadName } from "../vo/Name";
import { Name as UserName } from "../../user/vo/Name";

type CreateSquadResponse = Promise<string>;

export class CreateSquadHandler{
    constructor(private squadRepository: ISquadRepository) {}

    public async execute(command: CreateSquadCommand): CreateSquadResponse
    {
        const squadId = new UniqueEntityID();
        const userId = new UniqueEntityID();

        const userNameVO = UserName.create(command.userName)
        const emailVO = Email.create(command.email);

        const user = User.create({
            name: userNameVO,
            email: emailVO,
            squadId: squadId,
            role: UserRole.OWNER
        }, userId);

        const squadNameVO = SquadName.create(command.squadName);
        const squad = Squad.create({
            name: squadNameVO,
            ownerId: userId
        }, squadId);

        await this.squadRepository.saveWithOwner(squad, user);

        return squad.id.toString();
    }
}