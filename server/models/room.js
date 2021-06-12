'use strict';
module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define('Room', {
    name: DataTypes.STRING,
    players: DataTypes.JSON,
    isPlaying: DataTypes.BOOLEAN
  }, {});
  Room.associate = function (models) {
    // associations can be defined here
  };
  return Room;
};