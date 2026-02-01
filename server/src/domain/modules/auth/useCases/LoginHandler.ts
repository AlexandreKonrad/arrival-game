import { IUserRepository } from "../../user/repositories/IUserRepository";
import { AuthErrors } from "../errors/AuthErrors";
import { User } from "../../user/entities/User";

type LoginInput = {
    emailFromToken: string;
}

type LoginOutput = {
    user: User;
}

export class LoginHandler{
    constructor(
        private userRepository: IUserRepository
    ) {}

    public async execute({ emailFromToken }: LoginInput): Promise<LoginOutput>
    {
        const user = await this.userRepository.findByEmail(emailFromToken);

        if (!user) throw new AuthErrors.UserNotFound(emailFromToken);

        return { user };
    }
}