import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user", (table) => {
        table.uuid("id_user").primary().defaultTo(knex.fn.uuid());
        table.string("name").notNullable();
        table.string("email").notNullable()
    
        table.enum("role", [
            "owner",
            "admin",
            "member"
        ]).notNullable().defaultTo("member");

        table.uuid(
            "fk_id_squad"
        ).notNullable().references(
            "id_squad"
        ).inTable(
            "squad"
        ).onDelete("CASCADE"); 

        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());

        table.unique(["email", "fk_id_squad"]);
        table.index(["email"], "idx_user_email");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("user");
}