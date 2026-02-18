import { ISquadRepository } from "../repositories/ISquadRepository";
import { IUserRepository } from "src/modules/user/domain/repositories/IUserRepository";
import { TokenProvider } from "src/modules/auth/domain/services/TokenProvider";

import { User } from "src/modules/user/domain/entities/User";
import { UserRole } from "src/modules/user/domain/enums/UserRole";

import { SquadCode } from "../vo/SquadCode";
import { Email as UserEmail } from "src/modules/user/domain/vo/Email";
import { Name as UserName } from "src/modules/user/domain/vo/Name";

import { SquadErrors } from "../errors/SquadErrors";
import { UserErrors } from "src/modules/user/domain/errors/UserErrors";

type JoinSquadInput = {
    squadCode: string;
    userEmail: string;
    userName: string;
};

type JoinSquadOutput = {
    user: User;
    refreshToken: string;
}

export class JoinSquadHandler {
    constructor(
        private squadRepository: ISquadRepository,
        private userRepository: IUserRepository,
        private tokenProvider: TokenProvider
    ) {}

    public async execute({squadCode, userEmail, userName}: JoinSquadInput): Promise<JoinSquadOutput>
    {
        const squadCodeVO = SquadCode.create(squadCode);
        const squad = await this.squadRepository.findByCode(squadCodeVO);
        if(!squad) throw new SquadErrors.NotFound();

        const userEmailVO = UserEmail.create(userEmail);
        const userExists = await this.userRepository.existsByEmail(userEmailVO);
        if(userExists) throw new UserErrors.EmailAlreadyExists();

        const newUser = User.create({
            squadId: squad.id,
            email: userEmailVO,
            role: UserRole.MEMBER,
            name: UserName.create(userName)
        });
        await this.userRepository.save(newUser);

        const refreshToken = await this.tokenProvider.generateRefreshToken(newUser.id);

        return {
            user: newUser,
            refreshToken: refreshToken
        };
    }

}