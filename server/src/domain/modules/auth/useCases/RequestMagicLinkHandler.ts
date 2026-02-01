import { IUserRepository } from "../../user/repositories/IUserRepository";
import { AuthErrors } from "../errors/AuthErrors";
import { User } from "../../user/entities/User";

type RequestMagicLinkInput = {
    email: string;
}

type RequestMagicLinkOutput = {
    user: User;
}

export class RequestMagicLinkHandler{
    constructor(
        private userRepository: IUserRepository
    ) {}

    public async execute({ email }: RequestMagicLinkInput): Promise<RequestMagicLinkOutput>
    {
        const user = await this.userRepository.findByEmail(email);
        
        if (!user) throw new AuthErrors.UserNotFound(email);

        return { user };
    }
}