require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
    }
);

const VcWrong     = require('./VcWrong')(sequelize, DataTypes);
const WordWrong   = require('./WordWrong')(sequelize, DataTypes);
const BookmarkVc  = require('./BookmarkVc')(sequelize, DataTypes);
const BookmarkWord = require('./BookmarkWord')(sequelize, DataTypes);
const GameRecord  = require('./GameRecord')(sequelize, DataTypes);
const Attendance  = require('./mypage/Attendance')(sequelize, DataTypes);
const LearningStat = require('./mypage/LearningStat')(sequelize, DataTypes);

module.exports = {
    sequelize,
    Sequelize,
    VcWrong,
    WordWrong,
    BookmarkVc,
    BookmarkWord,
    GameRecord,
    Attendance,
    LearningStat,
};
