const express = require("express");
const http = require("http");
const app = express()
const port = process.env.PORT || 4001;
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server);

var history = [];
var filteredHistory = [];
io.on("connection", (socket) => {

  var usuario = "";
  
  socket.on("conectado", (username, coordinates) =>{
     usuario = username
     history.push({username, coordinates});
     console.log(`${usuario} se conectó`)
     console.log("New History Coordinates => ",history)
     io.emit("mensaje", `${usuario} se conectó`)
     io.emit("coordenadas", history)
  })

  socket.on("disconnect", () => {
    console.log(`${usuario} se desconectó`)
    socket.broadcast.emit("mensaje", `${usuario} se desconectó`)
    filteredHistory = history.filter(item=>(item.username !== usuario))
    history = filteredHistory
    filteredHistory = []
    console.log("history filtered =>", history)
    io.emit("coordenadas", history)
   });

});


server.listen(port, () => console.log(`Listening on port ${port}`));