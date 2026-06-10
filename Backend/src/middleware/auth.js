import jwt from "jsonwebtoken";
import { readStore } from "../store.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "studymates-secret-key-123456";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const data = await readStore();
    const student = data.students.find((item) => item.id === decoded.id);

    if (!student) {
      return res.status(401).json({ message: "Unauthorized: Student not found" });
    }

    req.student = student;
    req.studentId = student.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}
