import { FastifyInstance } from "fastify";
import { app } from "../../src/app";
import { conn } from "../../src/shared/infra/database/conn";

export class TestApp{

    static async setUp(): Promise<FastifyInstance>
    {
        await conn.migrate.latest();
        await app.ready();
        return app;
    }

    static async tearDown(){
        await conn.migrate.rollback(undefined, true)
        await conn.destroy();
    }

    static async clearDb() {
        await conn('token').del();
        await conn('user').del();
        await conn('squad').del();
    }
}