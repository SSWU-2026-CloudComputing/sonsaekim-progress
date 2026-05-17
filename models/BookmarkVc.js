module.exports = (sequelize, DataTypes) => {
    const BookmarkVc = sequelize.define('BookmarkVc', {
        id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
        },
        user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        },
        vc_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        }
    }, {
        tableName: 'bookmark_vc',
        timestamps: false
    });
    
    return BookmarkVc;
    };
