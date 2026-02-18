import { UniqueEntityID } from "src/shared/core/UniqueEntityID";

import { ISquadRepository } from "../repositories/ISquadRepository";
import { IUserRepository } from "src/modules/user/domain/repositories/IUserRepository";
import { TokenProvider } from "src/modules/auth/domain/services/TokenProvider";

import { Squad } from "../entities/Squad";
import { Name as SquadName } from "../vo/Name";

import { User } from "../../../user/domain/entities/User";
import { UserRole } from "../../../user/domain/enums/UserRole";
import { Email } from "src/modules/user/domain/vo/Email";
import { Name as UserName } from "src/modules/user/domain/vo/Name";

import { UserErrors } from "../../../user/domain/errors/UserErrors";
import { SquadCode } from "../vo/SquadCode";

type CreateSquadInput = {
    squadName: string;
    email: string;
    userName: string;
};

type CreateSquadOutput = {
    user: User;
    refreshToken: string;
    squadCode: SquadCode
}

export class CreateSquadHandler{
    constructor(
        private squadRepository: ISquadRepository,
        private userRepository: IUserRepository,
        private tokenProvider: TokenProvider
    ) {}

    public async execute({squadName, email, userName}: CreateSquadInput): Promise<CreateSquadOutput>
    {
        const userEmailVO = Email.create(email);
        const userExists = await this.userRepository.existsByEmail(userEmailVO);
        if(userExists) throw new UserErrors.EmailAlreadyExists();

        const generatedSquadId = new UniqueEntityID();
        const generatedUserId = new UniqueEntityID();

        const newUser = User.create({
            squadId: generatedSquadId,
            email: userEmailVO,
            role: UserRole.OWNER,
            name: UserName.create(userName)
        }, generatedUserId);

        const newSquad = Squad.create({
            ownerId: generatedUserId,
            name: SquadName.create(squadName)
        }, generatedSquadId);
        
        await this.squadRepository.saveWithOwner(newSquad, newUser);

        const refreshToken = await this.tokenProvider.generateRefreshToken(newUser.id);

        return {
            user: newUser,
            refreshToken: refreshToken,
            squadCode: newSquad.code
        };
    }
}