module.exports = (sequelize, DataTypes) => {
    const WordWrong = sequelize.define('WordWrong', {
        word_wrong_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        word_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        is_follow: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        is_relearned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
        }, {
        tableName: 'word_wrong',
        timestamps: false
        });
        
        return WordWrong;
};
