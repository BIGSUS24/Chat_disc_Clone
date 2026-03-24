import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

// We wrap our Express app inside a standard HTTP server
const server = http.createServer(app);

// We attach Socket.IO to that server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // We will link this to your React frontend URL later
        methods: ["GET", "POST"]
    }
});

// A Map to store which user is hooked to which socket connection
// Think of it like a phonebook: { "userId_123": "socketId_456" }
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // When the frontend connects, they will send their unique User ID
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
    }

    // Tell everyone who is currently online
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // When a user closes the app/browser
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        delete userSocketMap[userId];

        // Update everyone about who is online now
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// We export 'app' and 'server' so index.js can use them!
export { app, io, server };
