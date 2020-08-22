import { promisify } from "util";
import { existsSync, unlinkSync } from "fs";
import { resolve } from "path";

const exec = promisify(require("child_process").exec);

describe("Scripts", () => {
  afterEach(() => {
    try {
      unlinkSync(resolve(process.cwd(), "exercises-psql.sql"));
    } catch (e) {
      console.warn("Nothing to delete");
    }
  });

  describe("psql-builder", () => {
    test("it creates an exercises-psql.sql file in the root", async () => {
      await exec("npm run build:psql", { cwd: process.cwd() });
      expect(existsSync(resolve(process.cwd(), "exercises-psql.sql"))).toBe(
        true
      );
    });
  });
});
