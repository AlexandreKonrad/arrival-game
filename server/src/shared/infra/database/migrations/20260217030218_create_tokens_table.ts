import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void>
{
    await knex.schema.createTable('token', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());

        table.string('token').notNullable().unique().index();

        table.enum('type',[
            'MAGIC',
            'REFRESH'
        ]).notNullable();

        table.uuid('fk_id_user')
            .references('id')
            .inTable('user')
            .onDelete('CASCADE');

        table.boolean('is_used').defaultTo(false);
        table.timestamp('expires_at').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void>
{
    await knex.schema.dropTable('token');
}