module.exports = (sequelize, DataTypes) => {
    const VcWrong = sequelize.define('VcWrong', {
    vc_wrong_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        },
    vc_id: {
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
    tableName: 'vc_wrong',
    timestamps: false
    });
    
    return VcWrong;
};
