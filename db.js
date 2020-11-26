// pg-promise Setup
const pgp = require("pg-promise")(); // import pg-promise
const connectionString = "postgresql://postgres:1973@localhost:5432/maxelecdb"; // URL where Postgres is running
const db = pgp(connectionString); // Connected db instance

module.exports = { pgp, db };
