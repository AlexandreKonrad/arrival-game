import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../../src/app';
import { conn } from '../../../src/infra/database/conn';

const BASE_ROUTE = '/squad';
const DEFAULT_EMAIL = 'e2e-test@arrival.com';
const DEFAULT_SQUAD_NAME = 'Squad E2E Test';

describe('Create Squad (E2E)', () => {

    const postSquad = (payload: object) => {
        return request(app.server).post(BASE_ROUTE).send(payload);
    };

    const makeSquadPayload = (overrides = {}) => ({
        squadName: DEFAULT_SQUAD_NAME,
        userName: 'Tester E2E',
        userEmail: DEFAULT_EMAIL,
        ...overrides
    });

    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await conn('user').where('email', DEFAULT_EMAIL).del();
        await conn('squad').where('name', DEFAULT_SQUAD_NAME).del();
        await app.close();
    });

    it('should be able to create a new squad and owner', async () => {
        const response = await postSquad(makeSquadPayload());

        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.objectContaining({
            squadId: expect.any(String),
            userId: expect.any(String)
        }));
    });

    it('should NOT be able to create a user with duplicated email', async () => {
        const payload = makeSquadPayload({
            squadName: 'Outro Squad Qualquer',
            userName: 'Clone'
        });

        const response = await postSquad(payload);

        expect(response.status).toBe(409);
        expect(response.body.message).toContain('already associated');
    });

    it('should validate invalid input (Zod)', async () => {
        const payload = makeSquadPayload({
            squadName: '',
            userEmail: 'not-an-email'
        });

        const response = await postSquad(payload);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('validation_error');
    });
});