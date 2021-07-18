// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./dev.exercises.sqlite3",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "database/migrations/",
      loadExtensions: [".ts"],
    },
    seeds: {
      directory: "database/seeds",
      loadExtensions: [".ts"],
    },
  },
};
