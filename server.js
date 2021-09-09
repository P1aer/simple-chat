const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.json())
app.use(express.urlencoded({ extended: true} ))

const rooms = new Map()

app.get("/rooms/:id", (req, res) => {
    const roomId = req.params.id
    const obj= rooms.has(roomId) ? {
        users : [...rooms.get(roomId).get("users").values()],
        messages : [...rooms.get(roomId).get("messages").values()]
    } : {users: [], messages: []}
    res.json(obj)
})

app.post("/rooms", (req, res) => {
   const { roomId, nickname } = req.body;
   if (!rooms.has(roomId)){
     rooms.set(roomId, new Map([
         ['users', new Map()],
        ['messages', []]
     ]))
   }
   res.send();
})

io.on("connection", socket => {
    socket.on('ROOM:JOIN',({ roomId, nickname }) => {
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, nickname);
        const users = [...rooms.get(roomId).get("users").values()];
        socket.to(roomId).emit("ROOM:SET_USERS",users);
    })
    socket.on("ROOM:NEW_MESSAGE", ({roomId, user, text}) => {
        const obj = {
            user,
            text
        }
        rooms.get(roomId).get("messages").push(obj)
        socket.to(roomId).emit("ROOM:SET_MESSAGES",obj)
    })
    socket.on("disconnect",() => {
        rooms.forEach((value, roomId) => {
            if (value.get("users").delete(socket.id)){
                const users = [...value.get("users").values()];
                socket.to(roomId).emit("ROOM:SET_USERS",users);
            }
        })
    })
})

server.listen(9999)
