const http = require("./http")
const io = require("socket.io")(http)
//const socketIO = require("socket.io")
const RoomController = require("./controllers/room")
//const PORT = process.env.PORT || 3000

//const io = new socketIO()

io.on("connection", function(socket){

  //===== BAGIAN LIST ROOM ======
  socket.on('create-room', function(roomData){

    RoomController.create(roomData, function(err, createdRoom){
      if(err) {
        socket.emit('show-error', 'Failed to create room')
      } else {
        io.emit('room-created', createdRoom) //send room to all client
        socket.join(createdRoom.name) //daftarin creator room ke room yang dia bikin
      
        socket.emit('get-in-to-room', {...createdRoom, playerKey: `1-${roomData.creator}`, isCreator : true})
      }
      
    })
  })

  socket.on("join-room", function(payload){
    RoomController.join(payload, function(err, result){
      if (err){
        socket.emit('show-error', 'Failed to join '+ payload.roomName )
      } else  {
        socket.join(payload.roomName) //daftarin player ke room yang dia mau join
        io.to(payload.roomName).emit('player-joined', result.players) // kabarin ke anggota room lain kalo ada yang join
        socket.emit('get-in-to-room', result) //nyuruh yang join untuk masuk ke room
        io.emit('update-client-room') //trigger semua client agar update rooms nya
      }
       
    })
  })

  socket.on('get-rooms', function(){
    RoomController.findAll()
    .then(rooms => {
      socket.emit("get-rooms", rooms) //trigger client untuk menampilkan rooms
    })
    .catch(err => {
      socket.emit('show-error',"Failed to get room data")
    })
  })

  // ====== BAGIAN PLAY ROOM ========

  // socket.on('leave-room', function(payload){
  //   socket.leave(payload.roomName)
  //   io.to(payload.roomName).emit('player-leave', payload.playerName)
  //   RoomController.leave(payload)
  //   .then(result => {
  //     io.emit('update-client-room')
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })
  // })

  socket.on('change-isplaying', function(payload){
    io.to(payload.roomName).emit('change-isplaying', payload.isPlaying) //trigger room untuk memulai/menghentikan permainan
  })
  socket.on('update-score', function(payload){
    socket.broadcast.to(payload.roomName).emit('update-score', payload) //trigger client untuk mengupdate score
  })
  socket.on('end-game', function(roomName){
    io.to(roomName).emit('end-game') //trigger room untuk menghentikan permainan
  })

})

// io.origins((origin, callback) => {
//   callback(null, true);
// })

// io.listen(PORT)