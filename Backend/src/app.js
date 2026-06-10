import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { ZodError } from "zod";
import classroomRoutes from "./routes/classroom.js";
import profileRoutes from "./routes/profile.js";
import studentRoutes from "./routes/students.js";
import teamRoutes from "./routes/teams.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

export const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL ?? "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "studymates-backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/classroom", classroomRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/profile", profileRoutes);

app.use((error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Validation failed", issues: error.flatten() });
  }

  if (error.code === "P2002") {
    return res.status(409).json({ message: "Record already exists" });
  }

  if (error.code === "P2025") {
    return res.status(404).json({ message: "Record not found" });
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});
