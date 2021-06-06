const { Room } = require("../models")
const kue = require("kue") //package untuk membuat & memproses antrian job di background
const queue = kue.createQueue({
  redis: process.env.REDIS_URL
})

//proses antrian job yang tersimpan di redis kita
queue.process('join-to-room', function (job, done) {

  const { payload } = job.data

  Room.findOne({
    where: {
      name: payload.roomName
    }
  })
    .then(result => {
      let index = Object.keys(result.players).length //hitung jumlah pemain dalam room untuk indexing player
      let playerKey = `${index + 1}-${payload.playerName}`
      result.players[playerKey] = 0
      result.changed("players", true)

      return Promise.all([result.save(), playerKey])
    })
    .then(([result, playerKey]) => {
      done(null, { ...result.dataValues, playerKey }) //jika berhasil, bawa data room yang telah terupdate dengan pemain baru agar dapat diambil oleh listener job nya
    })
    .catch(err => {
      done(err)
    })
})

class RoomController {
  static create(roomData, callback) {

    let newRoom = {
      name: roomData.name,
      players: {
        ["1-" + roomData.creator]: 0
      }
    }

    Room.create(newRoom)
      .then(createdRoom => {
        callback(null, createdRoom.dataValues) //bawa infomasi room yang baru saja dibuat
      })
      .catch(err => {
        console.log(err)
        callback(err)
      })

  }

  static join(payload, callback) {

    console.log(callback)
    var job = queue.create('join-to-room', {
      payload,
      callback
    }).save() //membuat job untuk join ke room

    job.on('complete', function (result) {
      console.log('Job completed with data ', result);
      callback(null, result)
    }) // listen event oncomplete nya job
      .on('failed', function (errorMessage) {
        callback("failed")
      })// listen jika join gagal
  }

  static findAll(callback) {
    console.log("masuuukk findAll")
    Room.findAll({
      order: [
        ['id', 'ASC'],
      ],
    })
      .then(results => {
        console.log("masuuukk then" + results)
        callback(null, results)
      })
      .catch(err => {
        console.log("masuuukk err" + err)
        callback(err)
      })

  }

  static delete(roomName, callback) {
    Room.destroy({
      where: {
        name: roomName
      }
    })
      .then(result => {
        console.log("Success delete room")
        callback(null)
      })
      .catch(err => {
        console.log(err)
      })
  }

  static leave(payload, callback) {
    Room.findOne({
      where: {
        name: payload.roomName
      }
    })
      .then(result => {
        if (result) {
          delete result.players[payload.playerKey];
          result.changed("players", true)
          return result.save()
        }
      })
      .then(result => {
        callback(null, result.dataValues)
      })
      .catch(err => {
        callback(err)
      })
  }
}

module.exports = RoomController