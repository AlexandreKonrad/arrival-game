import { IUserRepository } from "src/domain/modules/user/repositories/IUserRepository";
import { ISquadRepository } from "src/domain/modules/squad/repositories/ISquadRepository";
import { SquadErrors } from "../errors/SquadErrors";
import { UserErrors } from "src/domain/modules/user/errors/UserErrors";
import { Name as UserName } from "src/domain/modules/user/vo/Name";
import { Email as UserEmail } from "src/domain/modules/user/vo/Email";
import { User } from "src/domain/modules/user/entities/User";
import { UserRole } from "src/domain/modules/user/enums/UserRole";

export interface JoinSquadCommand{
    userName: string;
    userEmail: string;
    squadCode: string;
};

type JoinSquadResponse = {
    userId: string;
    squadId: string;
}

export class JoinSquadHandler {
    constructor(
        private squadRepository: ISquadRepository,
        private userRepository: IUserRepository
    ) {}

    public async execute(command: JoinSquadCommand): Promise<JoinSquadResponse>
    {
        const squad = await this.squadRepository.findByCode(command.squadCode);
        if(!squad) throw new SquadErrors.SquadNotFoundError(command.squadCode);

        const userExists = await this.userRepository.exists(command.userEmail);
        if(userExists) throw new UserErrors.EmailAlreadyExists(command.userEmail);

        const user = User.create({
            name: UserName.create(command.userName),
            email: UserEmail.create(command.userEmail),
            squadId: squad.id,
            role: UserRole.MEMBER
        });

        await this.userRepository.save(user);

        return {
            userId: user.id.toString(),
            squadId: squad.id.toString()
        };
    }

}