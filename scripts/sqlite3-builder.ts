// npm run build:sqlite <db.name> | 'exercises';

import { writeFileSync } from "fs";
import { EOL } from "os";
import { v4 as uuid } from "uuid";
import knex, { CreateTableBuilder } from "knex";
import snakecase from "lodash.snakecase";
import { Exercise } from "../types/exercise";
import { getDirectories, getExercises } from "./builders";

const sqlite3 = knex({
  client: "sqlite3",
  wrapIdentifier: (value, origImpl) => origImpl(snakecase(value)),
});

const tableName = process.argv[2] || "exercises";

const createTable = (
  exercises: Array<Exercise>,
  field: string,
  tableName: string
): Array<String> => {
  const lines: Array<String> = [];
  const dropTableStatement = sqlite3.schema
    .dropTableIfExists(tableName)
    .toQuery()
    .toString();
  lines.push(`${dropTableStatement};`, EOL);
  const createTableStatement = sqlite3.schema
    .createTable(tableName, (tableBuilder: CreateTableBuilder): void => {
      tableBuilder.increments().primary();
      tableBuilder.string("value");
      tableBuilder.timestamps();
    })
    .toQuery()
    .toString();
  lines.push(`${createTableStatement};`, EOL);
  const uniqueValues = Object.keys(
    exercises.reduce((obj: any, ex: any) => {
      const exField = ex[field];
      if (Array.isArray(exField)) obj[exField[0]] = true;
      else if (exField) obj[exField] = true;
      return obj;
    }, {})
  );
  uniqueValues.forEach((uniqueValue, index) => {
    const timestamp = Date.now();
    const insertLine = sqlite3
      .insert({
        id: ++index,
        value: uniqueValue,
        created_at: timestamp,
        updated_at: timestamp,
      })
      .into(tableName)
      .toQuery()
      .toString();
    lines.push(`${insertLine};`, EOL);
  });
  return lines;
};

// Helpers
const createSQLComment = (comment: string): string => `-- ${comment}`;

const createLineBreak = (amount: number = 1): Array<string> =>
  [...new Array(amount)].map(() => EOL);

const createExercisesTable = (): string => {
  const timestamp = Date.now();
  const createTable = sqlite3.schema
    .createTable(tableName, (tableBuilder: CreateTableBuilder): void => {
      tableBuilder.increments().primary();
      tableBuilder.string("name").notNullable().unique();
      tableBuilder.integer("primary_muscles").unsigned().notNullable();
      tableBuilder.integer("secondary_muscles").unsigned().notNullable();
      tableBuilder.integer("force").unsigned().nullable();
      tableBuilder.integer("level").unsigned().notNullable();
      tableBuilder.integer("mechanic").unsigned().nullable();
      tableBuilder.integer("equipment").unsigned().nullable();
      tableBuilder.integer("category").unsigned().notNullable();
      tableBuilder.text("instructions");
      tableBuilder.text("description");
      tableBuilder.text("tips");
      tableBuilder.timestamp("date_created").notNullable().defaultTo(timestamp);
      tableBuilder.timestamp("date_updated").notNullable().defaultTo(timestamp);
    })
    .toQuery()
    .toString();
  return `${createTable};`;
};

const createInsertStatement = (
  table: string,
  exercises: Array<Exercise>
): string => {
  // TODO: fix insert for sqlite3...
  return sqlite3(table).insert(exercises).toQuery().toString();
};

// Main
const directories = getDirectories("./exercises");
const exercises = getExercises(directories);

enum Tables {
  PRIMARY_MUSCLES = "primaryMuscles",
  FORCE = "force",
  LEVEL = "level",
  MECHANIC = "mechanic",
  EQUIPMENT = "equipment",
  CATEGORY = "category",
}

const sqlContents = [
  createSQLComment("Database Setup File"),
  ...createLineBreak(),
  createSQLComment("Drop Exercises Table"),
  ...createLineBreak(),
  `DROP TABLE IF EXISTS ${tableName};`,
  ...createLineBreak(2),
  createSQLComment("ENUMS"),
  ...createLineBreak(),
  ...createTable(exercises, Tables.PRIMARY_MUSCLES, "muscle"),
  ...createLineBreak(),
  ...createTable(exercises, Tables.FORCE, "forceType"),
  ...createLineBreak(),
  ...createTable(exercises, Tables.LEVEL, "levelType"),
  ...createLineBreak(),
  ...createTable(exercises, Tables.MECHANIC, "mechanicType"),
  ...createLineBreak(),
  ...createTable(exercises, Tables.EQUIPMENT, "equipmentType"),
  ...createLineBreak(),
  ...createTable(exercises, Tables.CATEGORY, "categoryType"),
  ...createLineBreak(2),
  createSQLComment("Create Exercises Table"),
  ...createLineBreak(),
  createExercisesTable(),
  ...createLineBreak(2),
  createSQLComment("Insert exercises"),
  ...createLineBreak(1),
  createInsertStatement(
    tableName,
    exercises.map((n: Exercise) => ({ ...n, id: uuid() }))
  ),
];

writeFileSync("./exercises-sqlite3.sql", sqlContents.join(""), "utf-8");
console.log("File written");
