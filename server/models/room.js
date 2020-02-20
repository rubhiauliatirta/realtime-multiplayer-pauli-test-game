'use strict';
module.exports = (sequelize, DataTypes) => {

  const {Model } = sequelize.Sequelize
  class Room extends Model{}

  Room.init({
    name: {
      type : DataTypes.STRING,
      validate : {
        len: {
          args: [4,12],
          msg: "String length is not in this range"
        } 
      }
    },
    players: {
      type : DataTypes.JSON,
      validate : {
        isLessThanFour(value){
          if(Object.keys(value).length > 4) {
            throw new Error('Maximum player is 4')
          }
        }
      }
    } 
  }, {
    sequelize
  })

  Room.associate = function(models) {
    // associations can be defined here
  };
  return Room;
};