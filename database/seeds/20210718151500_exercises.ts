import Knex from "knex";
import { Dirent, readdirSync } from "fs";
import { Exercise } from "../../types/exercise";
import { resolve } from "path";
import { EOL } from "os";

const getDirectories = (folder: string): Array<Dirent> => {
  return readdirSync(folder, {
    withFileTypes: true,
  }).filter((dir) => dir.isDirectory());
};

const getExercises = (directories: Array<Dirent>): Array<Exercise> => {
  return directories.map((dir) => {
    const exercisePath = resolve(`./exercises/${dir.name}/exercise.json`);
    return require(exercisePath);
  });
};

const getEnumId = async (knex: Knex, tableName: string, value: any) => {
  if (value === null) {
    return null;
  }
  const enumId = await knex(tableName)
    .select("id")
    .where({
      value,
    })
    .first();
  if (enumId) {
    return enumId.id;
  }
  // This value hasn't been inserted yet...
  const count = await knex(tableName).count<number>({ count: "*" });
  // @ts-ignore
  const id = 1 + count.count;
  await knex(tableName).insert({
    id,
    value,
  });
  return id;
};

const insertExercises = async (knex: Knex): Promise<void> => {
  const directories = getDirectories("./exercises");
  const exercises = getExercises(directories);
  for (const exercise of exercises) {
    let index = exercises.indexOf(exercise);
    // Add new exercise
    const instructions = exercise.instructions
      ? exercise.instructions.join(EOL)
      : [];
    const tips = exercise.tips ? exercise.tips.join(EOL) : [];
    const force_id = await getEnumId(knex, "force", exercise.force);
    const level_id = await getEnumId(knex, "level", exercise.level);
    const mechanic_id = await getEnumId(knex, "mechanic", exercise.mechanic);
    const equipment_id = await getEnumId(knex, "equipment", exercise.equipment);
    const category_id = await getEnumId(knex, "category", exercise.category);
    const exerciseId = ++index;
    const data = {
      id: exerciseId,
      name: exercise.name,
      force_id,
      level_id,
      mechanic_id,
      equipment_id,
      category_id,
      instructions,
      description: exercise.description,
      tips,
    };
    await knex("exercises").insert(data);
    // And also add its relationships
    for (const muscle of exercise.primaryMuscles) {
      const primaryMuscleId = await getEnumId(knex, "muscles", muscle);
      await knex("exercises_primary_muscles").insert({
        exercise_id: exerciseId,
        muscle_id: primaryMuscleId,
      });
    }
    for (const muscle of exercise.secondaryMuscles) {
      const secondaryMuscleId = await getEnumId(knex, "muscles", muscle);
      await knex("exercises_secondary_muscles").insert({
        exercise_id: exerciseId,
        muscle_id: secondaryMuscleId,
      });
    }
  }
};

exports.seed = (knex: Knex) =>
  Promise.all([
    knex("exercises_secondary_muscles").del(),
    knex("exercises_primary_muscles").del(),
    knex("exercises").del(),
  ]).then(() => insertExercises(knex));

exports.config = { transaction: false };
