module.exports = (sequelize, DataTypes) => {
const BookmarkWord = sequelize.define('BookmarkWord', {
    id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
    },
    user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    },
    word_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    }
}, {
    tableName: 'bookmark_word',
    timestamps: false,
    underscored: true
});

return BookmarkWord;
};
