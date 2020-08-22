import { promisify } from "util";
import { existsSync, unlinkSync } from "fs";
import { resolve } from "path";

const exec = promisify(require("child_process").exec);

describe("Scripts", () => {
  afterEach(() => {
    try {
      unlinkSync(resolve(process.cwd(), "exercises.json"));
    } catch (e) {
      console.warn("Nothing to delete");
    }
  });

  describe("json-builder", () => {
    test("it creates an exercise.json file in the root", async () => {
      await exec("npm run build:json", { cwd: process.cwd() });
      expect(existsSync(resolve(process.cwd(), "exercises.json"))).toBe(true);
    });
  });
});
