const express = require("express");
const http = require("http");
const app = express();
const port = process.env.PORT || 4001;
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let history = [];

io.on("connection", (socket) => {
  let user = "";

  // When a user connects
  socket.on("connected", (username) => {
    user = username;
    console.log(`${user} connected`);
    io.emit("message", `${user} connected`);

    // Send the existing markers to the newly connected client
    socket.emit("coordinates", history);
  });

  // Refresh coordinates and message
  socket.on("refreshCoordinates", (username, coordinates, message) => {
    console.log(`Received coordinates from ${username}:`, coordinates, message);
    history = history.filter((item) => item.username !== username);
    history.push({ username, coordinates, message });
    console.log("Updated History => ", history);
    io.emit("coordinates", history); // Broadcast updated history to all clients
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log(`${user} disconnected`);
    io.emit("message", `${user} disconnected`);
    history = history.filter((item) => item.username !== user);
    console.log("Filtered History =>", history);
    io.emit("coordinates", history);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
