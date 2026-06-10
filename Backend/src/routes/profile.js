import { Router } from "express";
import jwt from "jsonwebtoken";
import { readStore } from "../store.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "studymates-secret-key-123456";

router.get("/me", async (req, res, next) => {
  try {
    const data = await readStore();
    let studentId = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        studentId = decoded.id;
      } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
    } else if (req.query.studentId) {
      studentId = Number(req.query.studentId);
    } else {
      // Fallback for default student if no auth header and no studentId query
      const student = data.students.find((item) => item.studentCode === "20211013");
      if (student) {
        const { password, ...studentProfile } = student;
        return res.json(studentProfile);
      }
      return res.status(401).json({ message: "Unauthorized: Missing authentication" });
    }

    const student = data.students.find((item) => item.id === studentId);
    if (!student) return res.status(404).json({ message: "Profile not found" });

    const { password, ...studentProfile } = student;
    res.json(studentProfile);
  } catch (error) {
    next(error);
  }
});

export default router;
