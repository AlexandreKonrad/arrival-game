import { UserController } from "../controllers/UserController";
import { KnexUserRepository } from "../database/repositories/KnexUserRepository";
import { GetUserProfileHandler } from "../../domain/useCases/GetUserProfileHandler";

export function makeUserController(): UserController {
    const userRepository = new KnexUserRepository();
    const getUserProfileHandler = new GetUserProfileHandler(userRepository);
    
    return new UserController(getUserProfileHandler);
}