import { AuthController } from "../controllers/AuthController";

import { KnexUserRepository } from "src/modules/user/infra/database/repositories/KnexUserRepository";
import { KnexTokenRepository } from "../database/repositories/KnexTokenRepository";

import { TokenProvider } from "../../domain/services/TokenProvider";

import { LoginHandler } from "../../domain/useCases/LoginHandler";
import { RefreshTokenHandler } from "../../domain/useCases/RefreshTokenHandler";
import { RequestMagicLinkHandler } from "../../domain/useCases/RequestMagicLinkHandler";

export function makeAuthController(){
    const userRepo = new KnexUserRepository();
    const tokenRepo = new KnexTokenRepository();

    const tokenProvider = new TokenProvider(tokenRepo);

    const loginHandler = new LoginHandler(tokenRepo, userRepo, tokenProvider);
    const refreshTokenHandler = new RefreshTokenHandler(tokenRepo, userRepo, tokenProvider);
    const requestMagicLinkHandler = new RequestMagicLinkHandler(userRepo, tokenProvider);

    const controller = new AuthController(
        requestMagicLinkHandler, 
        loginHandler,
        refreshTokenHandler
    );

    return controller;
}