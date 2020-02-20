const { Room } = require("../models")
const kue = require("kue")
const queue = kue.createQueue({
  redis: process.env.REDIS_URL
})


queue.process('join-to-room', function(job, done){
 
  const {payload, callback} = job.data
  console.log(payload, "ini payload")
  //console.log(callback, "ini cal")
  Room.findOne({
    where : {
      name :payload.roomName
    }
  }).then(result => {
    let index = Object.keys(result.players).length
    let playerKey = `${index+1}-${payload.playerName}`
    result.players[playerKey] = 0
    result.changed("players", true)
    
    return Promise.all([result.save(), playerKey])
  })
  .then(([result, playerKey]) => {
    done(null, {...result.dataValues, playerKey})
  })
  .catch(err => {  
    done(err)
  })
})

class RoomController {
  static create(roomData, callback){

    let newRoom = {
      name : roomData.name,
      players : {
        ["1-" + roomData.creator] : 0
      }
    }

    Room.create(newRoom)
    .then(createdRoom => {   
      callback(null, createdRoom.dataValues)
    })
    .catch(err => {
      console.log(err)
      callback(err)
    })

  }

  static join(payload, callback){

    console.log(callback)
    var job = queue.create('join-to-room', {
        payload, 
        callback
    }).save()

    job.on('complete', function(result){
      console.log('Job completed with data ', result);
      callback(null, result)
    })
    
  }

  static findAll(){
    return Room.findAll({
      order: [
        ['id', 'ASC'],
      ],
    })
  }

  // static leave(payload){
  //   Room.findOne({
  //     where : {
  //       name : payload.roomName
  //     }
  //   })
  //   .then(result => {
  //     if(result){
  //       delete result.players[payload.playerKey];
  //       result.changed("players", true)
  //       return result.save()
  //     } 
  //   })
  // }
}

module.exports = RoomController