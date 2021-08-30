const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const rooms = new Map()

app.get ("/rooms", (req, res) => {
   res.json(rooms);
})

io.on("connection", socket => {
   console.log("socket connect", socket)
})

server.listen(9999)
