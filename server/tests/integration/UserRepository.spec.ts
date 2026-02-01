import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { conn } from '../../src/infra/database/conn';
import { KnexUserRepository } from '../../src/infra/database/persistence/knex/KnexUserRepository';
import { User } from '../../src/domain/modules/user/entities/User';
import { Name } from '../../src/domain/modules/user/vo/Name';
import { Email } from '../../src/domain/modules/user/vo/Email';
import { UserRole } from '../../src/domain/modules/user/enums/UserRole';
import { UniqueEntityID } from '../../src/domain/shared/core/UniqueEntityID';

describe('KnexUserRepository (Integration)', () => {
    
    const userRepository = new KnexUserRepository();
    
    const squadId = new UniqueEntityID(); 
    const squadIdString = squadId.toString();
    const testEmail = 'integration.test@arrival.com';

    beforeAll(async () => {
        await conn('squad').insert({
            id: squadIdString,
            name: 'Squad Integration Test',
            code: 'INT999',
            fk_id_owner: null,
            created_at: new Date()
        });
    });

    afterAll(async () => {
        await conn('user').where('fk_id_squad', squadIdString).del();
        await conn('squad').where('id', squadIdString).del();

        await conn.destroy(); 
    });

    beforeEach(async () => {
        await conn('user').where('email', testEmail).del();
    });

    it('should be able to save a user', async () => {
        const user = User.create({
            name: Name.create('Integration Tester'),
            email: Email.create(testEmail),
            squadId: squadId,
            role: UserRole.MEMBER
        });

        await userRepository.save(user);

        const savedUser = await conn('user').where('email', testEmail).first();
        
        expect(savedUser).toBeDefined();
        expect(savedUser.role).toBe(UserRole.MEMBER);
    });

    it('should be able to find a user by email (mapping back to Domain)', async () => {
        const user = User.create({
            name: Name.create('Mapper Tester'),
            email: Email.create(testEmail),
            squadId: squadId,
            role: UserRole.OWNER
        });
        await userRepository.save(user);

        const foundUser = await userRepository.findByEmail(testEmail);

        expect(foundUser).not.toBeNull();
        expect(foundUser?.email.value).toBe(testEmail);
        expect(foundUser?.name.value).toBe('Mapper Tester');
        expect(foundUser?.role).toBe(UserRole.OWNER);
        expect(foundUser?.squadId.toString()).toBe(squadIdString);
    });

    it('should return null if user does not exist', async () => {
        const foundUser = await userRepository.findByEmail('ghost@arrival.com');
        expect(foundUser).toBeNull();
    });

    it('should return true if email exists', async () => {
        const user = User.create({
            name: Name.create('Exists Check'),
            email: Email.create(testEmail),
            squadId: squadId,
            role: UserRole.MEMBER
        });
        await userRepository.save(user);

        const exists = await userRepository.exists(testEmail);
        const notExists = await userRepository.exists('nobody@arrival.com');

        expect(exists).toBe(true);
        expect(notExists).toBe(false);
    });
});