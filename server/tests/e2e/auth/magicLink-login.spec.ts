import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';
import { conn } from '../../../src/infra/database/conn';
import { TokenExpires } from '../../../src/domain/modules/auth/enums/TokenExpires';
import { TokenTypes } from '../../../src/domain/modules/auth/enums/TokenTypes';

const ROUTES = {
    SQUAD: '/squad',
    MAGIC_LINK: '/auth/magic-link',
    LOGIN: '/auth/login'
};

const MOCK_DATA = {
    squadName: 'Magic Squad',
    userName: 'Magic User',
    userEmail: 'magic@link.com'
};

describe('Auth: Magic Link Login (E2E)', () => {

    let createdSquadId: string;

    beforeAll(async () => { 
        await app.ready(); 
        
        const response = await request(app.server).post(ROUTES.SQUAD).send(MOCK_DATA);
        createdSquadId = response.body.squadId;
    });

    afterAll(async () => {
        await conn('user').where('email', MOCK_DATA.userEmail).del();
        await conn('squad').where('id', createdSquadId).del();
        await app.close();
    });

    it('should be able to request a magic link for an existing email', async () => {
        const response = await request(
            app.server
        ).post(
            ROUTES.MAGIC_LINK
        ).send({
            email: MOCK_DATA.userEmail
        });

        expect(response.status).toBe(200);
        expect(response.body.message).toContain('Magic link sent!');
    });

    it('should NOT accept emails that are not registered', async () => {
        const response = await request(
            app.server
        ).post(
            ROUTES.MAGIC_LINK
        ).send({
            email: 'ghost@arrival.com'
        });
        
        expect(response.status).toBe(404);
    });

    it('should exchange the magic token for a session token with correct SQUAD ID', async () => {
        const magicToken = app.jwt.sign(
            { email: MOCK_DATA.userEmail, type: TokenTypes.MAGIC }, 
            { expiresIn: TokenExpires.MIN_15 }
        );

        const response = await request(
            app.server
        ).post(
            ROUTES.LOGIN
        ).send({
            token: magicToken
        });
        expect(response.status).toBe(200);
        
        const sessionToken = response.body.token;
        const decoded = app.jwt.decode<any>(sessionToken);

        expect(decoded.squadId).toBe(createdSquadId);
        expect(decoded.role).toBe('OWNER');
    });
});