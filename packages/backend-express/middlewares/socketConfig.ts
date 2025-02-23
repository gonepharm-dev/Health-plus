import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt, { type JwtPayload } from 'jsonwebtoken'
import DatabaseInstance from "./database";
import AppError from "../utils/AppError";

dotenv.config();

const initializeSocket = (io: Server) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new AppError("Authentication failed: No token provided.", 401));

            const decodedToken = jwt.decode(token)as JwtPayload;

            const authData = await DatabaseInstance.collection("users").getOne(decodedToken.id);
            socket.data.user = authData.record;
            next();
        } catch (error) {
            next(new AppError("Authentication failed: Invalid token.", 401));
        }
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.data.user.username}`);

        socket.on("sendMessage", async ({ message, room }) => {
            if (!message) return;

            await DatabaseInstance.collection("ChatMessages").create({
                sender_id: socket.data.user.id,
                text: message,
                room: room || "general",
                time: new Date().toISOString(),
            });

            io.to(room || "general").emit("receiveMessage", {
                receiver_id: socket.data.user.username,
                text: message,
                time: new Date().toISOString(),
            });
        });

        socket.on("joinRoom", (room) => {
            socket.join(room);
            console.log(`${socket.data.user.username} joined room: ${room}`);
        });

        socket.on("disconnect", () => {
            console.log(`${socket.data.user.username} disconnected.`);
        });
    });
};

export default initializeSocket;