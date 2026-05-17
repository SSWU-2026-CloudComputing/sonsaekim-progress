// models/WrongAnswer.js (수정 후)
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db');

const WrongAnswer = sequelize.define('WrongAnswer', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:    { type: DataTypes.INTEGER, allowNull: false },  // FK 제거, 값만 보관
  signId:    { type: DataTypes.INTEGER, allowNull: false },  // FK 제거, 값만 보관
  signType:  { type: DataTypes.ENUM('vc', 'word'), allowNull: false },
  quizId:    { type: DataTypes.INTEGER },
  wrongAt:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = WrongAnswer;
