import express from "express";
import {Server} from "socket.io";
import {createServer} from "http";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config({
    path: "./config.env"
});

const users = [{}];

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket)=> {
    console.log("New Connection!!");
    
    socket.on('joined', ({user})=> {
        users[socket.id] = user;
        socket.broadcast.emit('joined', `${user} has joined!`);
    });

    socket.emit("welcome", `Welcome to Chat Application!🥰`);

    socket.on("message", (message)=> {
        io.emit("message", message);
    })

    socket.on("disconnect", ()=> {
        socket.broadcast.emit("leave", "User has left the chat!");
        console.log(`User disconnected! ${socket.id}`);
    })
})

app.get("/", (req, res)=> {
    res.send("<h1>Server is working!</h1>");
});

server.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port: ${process.env.PORT}`);
});