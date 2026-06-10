import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { readStore, writeStore } from "../store.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "studymates-secret-key-123456";

const registerSchema = z.object({
  studentCode: z.string().min(3, "Mã số sinh viên phải có ít nhất 3 ký tự"),
  name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  major: z.string().min(2, "Vui lòng chọn chuyên ngành")
});

const loginSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(1, "Mật khẩu không được để trống")
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const data = await readStore();

    const emailLower = payload.email.trim().toLowerCase();
    const studentCodeClean = payload.studentCode.trim();

    // Check unique email
    const emailExists = data.students.some((s) => s.email.toLowerCase() === emailLower);
    if (emailExists) {
      return res.status(409).json({ message: "Email này đã được đăng ký" });
    }

    // Check unique student code
    const codeExists = data.students.some((s) => s.studentCode === studentCodeClean);
    if (codeExists) {
      return res.status(409).json({ message: "Mã số sinh viên này đã được sử dụng" });
    }

    const hashedPassword = bcrypt.hashSync(payload.password, 10);
    const studentId = Math.max(0, ...data.students.map((item) => item.id)) + 1;

    // Generate random avatar index between 1 and 60
    const avatarIndex = Math.floor(Math.random() * 60) + 1;

    const newStudent = {
      id: studentId,
      studentCode: studentCodeClean,
      name: payload.name.trim(),
      email: emailLower,
      password: hashedPassword,
      major: payload.major,
      avatar: `https://i.pravatar.cc/120?img=${avatarIndex}`,
      targetGrade: "A",
      commitmentHours: "8h/tuần",
      status: "LOOKING",
      rating: 5.0,
      ratingCount: 0,
      skills: [],
      bio: "Muốn tìm nhóm học tập phù hợp, có mục tiêu rõ ràng và làm việc nghiêm túc."
    };

    data.students.push(newStudent);
    await writeStore(data);

    // Create session token
    const token = jwt.sign({ id: newStudent.id, email: newStudent.email }, JWT_SECRET, {
      expiresIn: "7d"
    });

    const { password, ...studentProfile } = newStudent;
    res.status(201).json({
      token,
      student: studentProfile
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const data = await readStore();

    const emailLower = payload.email.trim().toLowerCase();
    const student = data.students.find((s) => s.email.toLowerCase() === emailLower);

    if (!student || !bcrypt.compareSync(payload.password, student.password)) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
    }

    const token = jwt.sign({ id: student.id, email: student.email }, JWT_SECRET, {
      expiresIn: "7d"
    });

    const { password, ...studentProfile } = student;
    res.json({
      token,
      student: studentProfile
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  const { password, ...studentProfile } = req.student;
  res.json({
    student: studentProfile
  });
});

export default router;
