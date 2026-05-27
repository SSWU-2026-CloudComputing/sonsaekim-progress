const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const UserLevel = sequelize.define('UserLevel', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:     { type: DataTypes.INTEGER, allowNull: false, unique: true },
  level:      { type: DataTypes.INTEGER, defaultValue: 1 },
  totalDays:  { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = UserLevel;
