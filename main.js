import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config(); // Load environment variables

const app = express();
const server = createServer(app); // Create HTTP server
/**
 * @type {import("socket.io").Server}
 */
const io = new Server(server); // Initialize Socket.IO with the HTTP server

let users = {};

app.use(express.static("public"));

io.on("connection", (socket) => {
    socket.on("join-room", (username, roomId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit("joined-room", username, roomId);
        if (!users[roomId]) {
            // Initialize the room if it doesn't exist
            users[roomId] = {
                players: {}, // Use an object to store players
                host: null, // Host will be assigned when the first player joins
            };
        }

        // If this is the first player joining, assign them as the host
        if (Object.keys(users[roomId].players).length === 0) {
            users[roomId].host = { socketID: socket.id, username: username };
        }

        // Add the player to the room
        users[roomId].players[socket.id] = username;
    });

    // Sends value gain from the host to all the users in room
    socket.on("value-send", (num, text, room) => {
        socket.broadcast.to(room).emit("value-recive", num, text);
    });

    socket.on("request-current-users", (room) => {
        // Sends everyone including sender
        io.to(room).emit("sending-user-data", users[room]);
    });

    socket.on("is-user-host", (username, room) => {
        // Check if the room exists and if there is a host
        let roomData = users[room];
    
        if (!roomData || !roomData.host) {
            socket.emit("host-not-or-yes", false);
            return;
        }
    
        // Compare if the current user is the host
        const isHost = roomData.host.socketID === socket.id;
    
        // Emit back the result to the user
        socket.emit("host-not-or-yes", isHost);
    });
    

    socket.on("game-started", (room) => {
        let roomData = users[room]
        roomData.gameStarted = true
        socket.broadcast.to(room).emit("game-started-everyone")
    })

    socket.on("win", (username, room) => {
        socket.broadcast.to(room).emit("win-notification", username);
    });

    socket.on("disconnect", () => {
        const disconnectedUserId = socket.id;

        // Iterate through rooms to check for the disconnected user
        Object.keys(users).forEach((room) => {
            if (
                users[room].players &&
                users[room].players[disconnectedUserId]
            ) {
                // Remove the disconnected user from the players list
                delete users[room].players[disconnectedUserId];

                // If there are no players left or the disconnected user is the host
                if (
                    Object.keys(users[room].players).length === 0 ||
                    users[room].host.socketID === disconnectedUserId
                ) {
                    // If the host is disconnecting
                    if (users[room].host.socketID === disconnectedUserId) {
                        // Emit to all other users in the room that the host has logged out
                        socket
                            .to(room)
                            .emit(
                                "host-logout",
                                "The host has logged out. The room will be closed."
                            );

                        // Delete the room from the users object
                        delete users[room];
                    }
                }
            }
        });
    });
});

setInterval(() => {
    console.log(users)
}, 5000)

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});
