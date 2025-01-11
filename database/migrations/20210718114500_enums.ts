import Knex from "knex";

// Migration to create the "enum" tables. These are lookup tables used
// by the main "exercises" table.

const ENUM_TABLES = [
  "muscles",
  "force",
  "level",
  "mechanic",
  "equipment",
  "category",
];

exports.up = async (knex: Knex) => {
  for (const table of ENUM_TABLES) {
    await knex.schema.createTable(table, (table) => {
      table.increments().primary();
      table.string("value").notNullable();
      table.timestamps();
    });
  }
};

exports.down = async (knex: Knex) => {
  for (const table of ENUM_TABLES) {
    await knex.schema.dropTable(table);
  }
};

exports.config = { transaction: false };
