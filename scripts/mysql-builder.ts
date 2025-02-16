import * as fs from "fs";
import * as path from "path";

/**
 * Generates a MySQL-compatible INSERT statement for the exercises data.
 * @param tableName - The name of the MySQL table.
 * @param exercises - Array of exercise objects.
 * @returns A string containing MySQL INSERT statements.
 */
function generateMySQLInsertStatements(tableName: string, exercises: Record<string, any>[]): string {
    return exercises
        .map((exercise) => {
            const columns = Object.keys(exercise).map((key) => `\`${key}\``).join(", ");
            const values = Object.values(exercise)
                .map((value) =>
                    value === null
                        ? "NULL"
                        : Array.isArray(value)
                            ? `'${JSON.stringify(value).replace(/'/g, "\\'")}'`
                            : typeof value === "string"
                                ? `'${value.replace(/'/g, "\\'")}'`
                                : value
                )
                .join(", ");
            return `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values});`;
        })
        .join("\n");
}

/**
 * Main function to generate a MySQL-compatible data.sql file.
 */
async function main() {
    const inputFilePath = path.resolve(__dirname, "../exercises.json");
    const outputFilePath = path.resolve(__dirname, "../data.sql");
    const tableName = "exercises";

    try {
        // Read and parse the input JSON file
        const rawData = fs.readFileSync(inputFilePath, "utf8");
        const parsedData = JSON.parse(rawData);

        if (!Array.isArray(parsedData.exercises)) {
            throw new Error("Invalid data structure: 'exercises' key must contain an array.");
        }

        const exercises = parsedData.exercises;

        // Generate MySQL INSERT statements
        const insertStatements = generateMySQLInsertStatements(tableName, exercises);

        // Write the generated SQL to the output file
        fs.writeFileSync(outputFilePath, "-- MySQL data.sql file for exercises\n\n" + insertStatements);
        console.log(`Successfully generated ${path.basename(outputFilePath)}`);
    } catch (error) {
        console.error("Error generating MySQL data.sql file:", error);
    }
}

// Execute the main function
main();