import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';
import { conn } from '../../../src/infra/database/conn';
import { UserRole } from '../../../src/domain/modules/user/enums/UserRole';

const ROUTES = {
    SQUAD: '/squad',
    ME: '/user/me'
};
const MOCK_DATA = {
    squadName: 'Auth Squad',
    userName: 'Auth User',
    userEmail: 'auth-test@arrival.com'
};

describe('Authentication Middleware (E2E)', () => {

    beforeAll(async () => { await app.ready(); });

    afterAll(async () => {
        await conn('user').where('email', MOCK_DATA.userEmail).del();
        await conn('squad').where('name', MOCK_DATA.squadName).del();
        await app.close();
    });

    const getValidToken = async () => {
        const response = await request(
            app.server
        ).post(
            ROUTES.SQUAD
        ).send(
            MOCK_DATA
        );

        return response.body.token;
    };

    it('should allow access to protected route with a valid token', async () => {
        const token = await getValidToken();

        const response = await request(
            app.server
        ).get(
            ROUTES.ME
        ).set(
            'Authorization', `Bearer ${token}`
        ).send();

        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('sub');
        expect(response.body.user.role).toBe(UserRole.OWNER);
    });

    it('should DENY access (401) when token is missing', async () => {
        const response = await request(
            app.server
        ).get(
            ROUTES.ME
        ).send();

        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/token/i);
    });

    it('should DENY access (401) with an invalid/malformed token', async () => {
        const response = await request(
            app.server
        ).get(
            ROUTES.ME
        ).set(
            'Authorization', 'Bearer BATATA-123'
        ).send();

        expect(response.status).toBe(401);
    });

    it('should DENY access (401) with a token from another secret (Signature Fail)', async () => {
        const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.AssinaturaInvalida";

        const response = await request(
            app.server
        ).get(
            ROUTES.ME
        ).set(
            'Authorization', `Bearer ${fakeToken}`
        ).send();

        expect(response.status).toBe(401);
    });
});