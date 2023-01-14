const { DataTypes } = require("sequelize");
const database = require("../utils/database");
const File = require("./File");

const User = database.define("User", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  password: {
    type: DataTypes.STRING,
  },
});

User.associate = function (models) {
  User.hasMany(File, { as: "files", foreignKey: "userId" });
};

module.exports = User;
