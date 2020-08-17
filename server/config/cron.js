const { Room } = require("../models")
var CronJob = require('cron').CronJob;


new CronJob('0 0 0 1 * *', function() {
  Room.destroy({ truncate: true })
  .then(result => {

    console.log("reset room at" + new Date())
    let newRoom = {
      name : "DemoRoom",
      players : {
        "1-Rubhi" : 0
      }
    }

    return Room.create(newRoom)
  })
  .then(createdRoom => {
    console.log("demo room created")
  })
  .catch(err => {
    console.log(err)
  })
}, null, true, 'Asia/Jakarta');