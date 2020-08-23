// npm run build:psql <db.name> | 'exercises';

import { readdirSync, Dirent, writeFileSync } from "fs";
import { EOL } from "os";
import { resolve } from "path";
import { v4 as uuid } from "uuid";
import knex from "knex";
import snakecase from "lodash.snakecase";
import { Exercise } from "../types/exercise";

const psql = knex({
  client: "pg",
  wrapIdentifier: (value, origImpl) => origImpl(snakecase(value)),
});

const tableName = process.argv[2] || "exercises";

//
const getDirectories = (folder: string): Array<Dirent> => {
  const subFolders = readdirSync(folder, {
    withFileTypes: true,
  }).filter((dir) => dir.isDirectory());

  return subFolders;
};

const getExercises = (directories: Array<Dirent>): Array<Exercise> => {
  return directories.map((dir) => {
    const exercisePath = resolve(`./exercises/${dir.name}/exercise.json`);
    return require(exercisePath);
  });
};

const createPostgresEnum = (
  exercises: Array<Exercise>,
  field: string,
  typeName: string
): string => {
  const enumValues = Object.keys(
    exercises.reduce((obj: any, ex: any) => {
      const exField = ex[field];
      if (Array.isArray(exField)) obj[exField[0]] = true;
      else if (exField) obj[exField] = true;
      return obj;
    }, {})
  );
  const enumString = enumValues.map((n) => `'${n}'`).join(",");
  const enumType = `CREATE TYPE ${typeName} AS ENUM (${enumString});`;
  return enumType;
};

// Helpers
const createSQLComment = (comment: string): string => `-- ${comment}`;

const createLineBreak = (amount: number = 1): Array<string> =>
  [...new Array(amount)].map(() => EOL);

const createExercisesTable = (): string => `
CREATE TABLE ${tableName} (
  id UUID,
  name Text NOT NULL,
  aliases Text[],
  primary_muscles muscle[],
  secondary_muscles muscle[],
  force forceType,
  level levelType NOT NULL,
  mechanic mechanicType,
  equipment equipmentType,
  category categoryType NOT NULL,
  instructions Text[],
  description Text,
  tips Text[],
  date_created timestamptz NOT NULL DEFAULT now(),
  date_updated timestamptz NOT NULL DEFAULT statement_timestamp(),
  PRIMARY KEY ("id"),
  UNIQUE ("name")
);
`;

const createInsertStatement = (
  table: string,
  exercises: Array<Exercise>
): string => {
  return psql(table).insert(exercises).toQuery().toString();
};

// Main
const directories = getDirectories("./exercises");
const exercises = getExercises(directories);

const psqlContents = [
  createSQLComment("Database Setup File"),
  ...createLineBreak(),
  `\\set ON_ERROR_STOP true`,
  ...createLineBreak(),
  `SET statement_timeout = 0;`,
  ...createLineBreak(),
  `SET client_encoding = 'UTF8';`,
  ...createLineBreak(),
  `SET standard_conforming_strings = on;`,
  ...createLineBreak(),
  `SET check_function_bodies = false;`,
  ...createLineBreak(),
  `SET client_min_messages = warning;`,
  ...createLineBreak(2),
  createSQLComment("Connect to DB"),
  ...createLineBreak(),
  `\\connect exercises-db;`,
  ...createLineBreak(2),
  createSQLComment("Drop Tables"),
  ...createLineBreak(),
  `DROP TABLE IF EXISTS ${tableName};`,
  ...createLineBreak(2),
  createSQLComment("ENUMS"),
  ...createLineBreak(),
  createPostgresEnum(exercises, "primaryMuscles", "muscle"),
  ...createLineBreak(),
  createPostgresEnum(exercises, "force", "forceType"),
  ...createLineBreak(),
  createPostgresEnum(exercises, "level", "levelType"),
  ...createLineBreak(),
  createPostgresEnum(exercises, "mechanic", "mechanicType"),
  ...createLineBreak(),
  createPostgresEnum(exercises, "equipment", "equipmentType"),
  ...createLineBreak(),
  createPostgresEnum(exercises, "category", "categoryType"),
  ...createLineBreak(2),
  createSQLComment("Create Exercises Table"),
  createExercisesTable(),
  ...createLineBreak(2),
  createSQLComment("Insert exercises"),
  ...createLineBreak(1),
  createInsertStatement(
    tableName,
    exercises.map((n: Exercise) => ({ ...n, id: uuid() }))
  ),
];

writeFileSync("./exercises-psql.sql", psqlContents.join(""), "utf-8");
console.log("File written");
