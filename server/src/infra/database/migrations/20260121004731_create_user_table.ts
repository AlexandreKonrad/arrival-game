import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user", (table) => {
        table.uuid("id").primary().defaultTo(knex.fn.uuid());
        table.string("name").notNullable();
        table.string("email").notNullable();
    
        table.enum("role", [
            "OWNER",
            "ADMIN",
            "MEMBER"
        ]).notNullable().defaultTo("MEMBER");

        table.uuid(
            "fk_id_squad"
        ).notNullable().references(
            "id"
        ).inTable(
            "squad"
        ).onDelete("CASCADE"); 

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

        table.unique(["email", "fk_id_squad"]);
        table.index(["email"], "idx_user_email");
    });

    await knex.schema.alterTable("squad", (table) => {
        table.foreign(
            "fk_id_owner"
        ).references(
            "id"
        ).inTable(
            "user"
        ).onDelete("SET NULL");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("squad", (table) => {
        table.dropForeign(["fk_id_owner"]);
    });

    await knex.schema.dropTable("user");
}