const config = require("config");
const Sequelize = require("sequelize");

const { host, port, password, username, dialect, baseName } = config.get(
  "DB_CONFIG"
);

const database = new Sequelize(baseName, username, password, {
  host,
  port,
  dialect,
  logging: false,
});

module.exports = database;
