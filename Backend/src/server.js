import { createServer } from "node:http";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { app } from "./app.js";

dotenv.config();

const port = process.env.PORT ?? 4000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // Put student in their own room
  socket.on("join-student-room", (studentId) => {
    socket.join(`student-${studentId}`);
    console.log(`[Socket] Student ${studentId} joined room: student-${studentId}`);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
  });
});

// Attach io instance to express app so it is accessible in routes
app.set("io", io);

httpServer.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
