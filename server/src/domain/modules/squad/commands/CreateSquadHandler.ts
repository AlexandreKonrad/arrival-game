import { UniqueEntityID } from "src/domain/shared/core/UniqueEntityID";
import { Squad } from "../entities/Squad";
import { User } from "../../user/entities/User";
import { UserRole } from "../../user/enums/UserRole";
import { ISquadRepository } from "../repositories/ISquadRepository";
import { IUserRepository } from "../../user/repositories/IUserRepository";
import { CreateSquadCommand } from "./CreateSquadCommand";
import { Email } from "../../user/vo/Email";
import { Name as SquadName } from "../vo/Name";
import { Name as UserName } from "../../user/vo/Name";
import { UserErrors } from "../../user/errors/UserErrors";

type CreateSquadResponse = {
    squadId: string;
    userId: string;
}

export class CreateSquadHandler{
    constructor(
        private squadRepository: ISquadRepository,
        private userRepository: IUserRepository
    ) {}

    public async execute(command: CreateSquadCommand): Promise<CreateSquadResponse>
    {
        const userExists = await this.userRepository.exists(command.email);
        if(userExists){
            throw new UserErrors.EmailAlreadyExists(command.email);
        }

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

        return {
            squadId: squad.id.toString(),
            userId: user.id.toString()
        }
    }
}