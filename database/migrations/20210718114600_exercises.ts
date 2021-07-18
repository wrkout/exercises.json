import Knex from "knex";

// Migration to create the main "exercises" table. It uses the "enum" tables
// that must have been created previously.

exports.up = (knex: Knex) => {
  return knex.schema
    .createTable("exercises", (table) => {
      table.increments().primary();
      table.string("name").notNullable().unique();
      table.integer("force_id").unsigned();
      table.integer("level_id").unsigned();
      table.integer("mechanic_id").unsigned();
      table.integer("equipment_id").unsigned();
      table.integer("category_id").unsigned();
      table.text("instructions");
      table.text("description");
      table.text("tips");
      table.timestamps();

      table.foreign("force_id").references("force.id");
      table.foreign("level_id").references("level.id");
      table.foreign("mechanic_id").references("mechanic.id");
      table.foreign("equipment_id").references("equipment.id");
      table.foreign("category_id").references("category.id");
    })
    .createTable("exercises_primary_muscles", (table) => {
      table.integer("exercise_id").unsigned();
      table.integer("muscle_id").unsigned();

      table.primary(["exercise_id", "muscle_id"]);
      table.foreign("exercise_id").references("exercises.id");
      table.foreign("muscle_id").references("muscles.id");
      table.timestamps();
    })
    .createTable("exercises_secondary_muscles", (table) => {
      table.integer("exercise_id").unsigned();
      table.integer("muscle_id").unsigned();

      table.primary(["exercise_id", "muscle_id"]);
      table.foreign("exercise_id").references("exercises.id");
      table.foreign("muscle_id").references("muscles.id");
      table.timestamps();
    });
};

exports.down = (knex: Knex) => {
  return knex.schema
    .dropTable("exercises_secondary_muscles")
    .dropTable("exercises_primary_muscles")
    .dropTable("exercises");
};

exports.config = { transaction: false };
