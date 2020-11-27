const { DB_NAME, PG_USER, PG_PASSWORD, PG_PORT } = require("../utils/config");
const connectionString = `postgresql://${PG_USER}:${PG_PASSWORD}@localhost:${PG_PORT}/${DB_NAME}`; // URL where Postgres is running
const pgp = require("pg-promise")();
const db = pgp(connectionString);

module.exports = { db };
