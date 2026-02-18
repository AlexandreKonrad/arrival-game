import { SquadController } from "../controllers/SquadController";

import { KnexSquadRepository } from "../database/repositories/KnexSquadRepository";
import { KnexUserRepository } from "src/modules/user/infra/database/repositories/KnexUserRepository";
import { KnexTokenRepository } from "src/modules/auth/infra/database/repositories/KnexTokenRepository";

import { TokenProvider } from "src/modules/auth/domain/services/TokenProvider";

import { CreateSquadHandler } from "../../domain/useCases/CreateSquadHandler";
import { JoinSquadHandler } from "../../domain/useCases/JoinSquadHandler";

export function makeSquadController(){
    const squadRepo = new KnexSquadRepository();
    const userRepo = new KnexUserRepository();
    const tokenRepo = new KnexTokenRepository();

    const tokenProvider = new TokenProvider(tokenRepo);

    const createSquadHandler = new CreateSquadHandler(squadRepo, userRepo, tokenProvider);
    const joinSquadHandler = new JoinSquadHandler(squadRepo, userRepo, tokenProvider);

    const controller = new SquadController(
        createSquadHandler,
        joinSquadHandler
    );

    return controller;
}