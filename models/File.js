const { DataTypes } = require("sequelize");
const database = require("../utils/database");
const User = require("./User");

const File = database.define("File", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  extension: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.STRING,
  },
  size: {
    type: DataTypes.INTEGER,
  },
  uploadAt: {
    type: DataTypes.DATE,
  },
});

File.associate = function (models) {
  File.hasOne(User, { as: "User", foreignKey: "userId" });
};

module.exports = File;
