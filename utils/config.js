require('dotenv').config();

const { DB_NAME, PG_PORT, PG_PASSWORD, PG_USER, APP_PORT } = process.env;

module.exports = {
  DB_NAME,
  PG_PASSWORD,
  PG_PORT,
  PG_USER,
  APP_PORT
};
