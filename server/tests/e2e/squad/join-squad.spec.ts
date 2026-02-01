import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../../src/app";
import { conn } from "../../../src/infra/database/conn";

const BASE_ROUTE = "/squad/join";
const TARGET_SQUAD_NAME = "Test Squad";

describe('Join Squad (E2E)', () => {

    const setupTargetSquad = async() => {
        await request(app.server).post('/squad').send({
            squadName: TARGET_SQUAD_NAME,
            userName: 'Líder Alpha',
            userEmail: 'lider@alpha.com'
        });

        return await conn('squad').where('name', TARGET_SQUAD_NAME).first();
    }

    const makeJoinPayload = (overrides = {}) => ({
        userName: 'Novo Membro',
        userEmail: 'membro@test.com',
        squadCode: 'VALIDO',
        ...overrides
    });

    beforeAll(async () => { await app.ready(); });

    afterAll(async () => {
        await conn('user').del();
        await conn('squad').del();
        await app.close();
    });

    it('should be able to join an existing squad with a valid code', async () => {
        const targetSquad = await setupTargetSquad();
        const payload = makeJoinPayload({ squadCode: targetSquad.code });

        const response = await request(
            app.server
        ).post(
            BASE_ROUTE
        ).send(payload);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('token');
        expect(response.body.squadId).toBe(targetSquad.id);
    });

    it('should NOT be able to join with an invalid code', async () => {
        const payload = makeJoinPayload({ squadCode: 'INVALI' });

        const response = await request(
            app.server
        ).post(
            BASE_ROUTE
        ).send(payload);

        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/not found/i);
    });

    it('should validate invalid input', async () => {
        const response = await request(
            app.server
        ).post(
            BASE_ROUTE
        ).send({
            userName: '',
            squadCode: ''
        });

        expect(response.status).toBe(400);
    });
});