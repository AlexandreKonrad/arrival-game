import { IUserRepository } from "../repositories/IUserRepository";
import { User } from "../entities/User";
import { UniqueEntityID } from "src/shared/core/UniqueEntityID";
import { UserErrors } from "../errors/UserErrors"; 

export class GetUserProfileHandler {
    constructor(private userRepository: IUserRepository) {}

    async execute(userId: string): Promise<User> {
        const user = await this.userRepository.findById(new UniqueEntityID(userId));

        if(!user) throw new UserErrors.NotFound();

        return user;
    }
}