module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define("Attendance", {
    attendance_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  }, {
    tableName: 'attendances',
    timestamps: false,
  });

  return Attendance;
};
