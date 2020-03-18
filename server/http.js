const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())

const http = require("http").createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, function(){
  console.log("server is running on PORT " + PORT)
})

module.exports = http