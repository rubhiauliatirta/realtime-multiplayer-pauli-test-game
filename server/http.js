const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())

app.get("/", function(req, res){
  res.send("Server is running")
})

const http = require("http").createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, function(){
  console.log("server is running on PORT " + PORT)
})

module.exports = http