import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { TestApp } from '../../utils/TestApp';
import { FastifyInstance } from 'fastify';
import { UserRole } from '../../../src/modules/user/domain/enums/UserRole';

describe('E2E: Full Squad Onboarding', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = await TestApp.setUp();
    });

    afterAll(async () => {
        await TestApp.tearDown();
    });
    
    beforeEach(async () => {
        await TestApp.clearDb();
    });

    it('should allow a user to create a squad and another to join via code', async () => {
        
        const createResponse = await app.inject({
            method: 'POST',
            url: '/squad',
            payload: {
                userEmail: "testeum@gmail.com",
                userName: "Teste um",
                squadName: "Teste Squad"
            }
        });

        expect(createResponse.statusCode).toBe(201);
        const { squadCode } = createResponse.json();
        
        expect(squadCode).toBeDefined();

        const joinResponse = await app.inject({
            method: 'POST',
            url: '/squad/join',
            payload: {
                userEmail: "testedois@gmail.com",
                userName: "Teste Dois",
                squadCode: squadCode
            }
        });

        expect(joinResponse.statusCode).toBe(201);
        
        const memberData = joinResponse.json();

        expect(memberData.user.name).toBe("Teste Dois");
        expect(memberData.user.email).toBe("testedois@gmail.com");
        expect(memberData.user.role).toBe(UserRole.MEMBER);
        
        expect(memberData.token).toBeDefined();
        expect(memberData.refreshToken).toBeDefined();
    });
});