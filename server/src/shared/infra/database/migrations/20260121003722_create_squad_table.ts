import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("squad", (table) => {
        table.uuid("id_squad").primary().defaultTo(knex.fn.uuid());
        table.string("name").notNullable();
    
    
        table.string("code", 6).notNullable().unique();
    
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

    
        table.index(["code"], "idx_squad_code");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("squad");
}