'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: DataTypes.STRING,
    players: DataTypes.JSON
  }, {});
  Room.associate = function(models) {
    // associations can be defined here
  };
  return Room;
};