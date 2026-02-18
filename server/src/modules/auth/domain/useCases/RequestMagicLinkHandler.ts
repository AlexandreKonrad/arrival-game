import { IUserRepository } from "src/modules/user/domain/repositories/IUserRepository";
import { AuthErrors } from "../errors/AuthErrors";
import { TokenProvider } from "../services/TokenProvider";
import { Email } from "src/modules/user/domain/vo/Email";

type RequestMagicLinkInput = {
    email: string;
}

type RequestMagicLinkOutput = {
    token: string;
}

export class RequestMagicLinkHandler{
    constructor(
        private userRepository: IUserRepository,
        private tokenProvider: TokenProvider
    ) {}

    public async execute({ email }: RequestMagicLinkInput): Promise<RequestMagicLinkOutput>
    {
        const emailVO = Email.create(email);
        const user = await this.userRepository.findByEmail(emailVO);
        if (!user) throw new AuthErrors.UserNotFound();

        const tokenStr = await this.tokenProvider.generateMagicLinkToken(user.id);

        return { token: tokenStr };
    }
}