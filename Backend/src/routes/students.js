import { Router } from "express";
import { readStore, writeStore } from "../store.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { query, skill, goal, status } = req.query;
    const data = await readStore();
    const normalizedQuery = String(query ?? "").trim().toLowerCase();

    const students = data.students.filter((student) => {
      const matchesQuery =
        !normalizedQuery ||
        student.name.toLowerCase().includes(normalizedQuery) ||
        student.studentCode.includes(normalizedQuery);
      const matchesSkill = !skill || skill === "Tất cả kỹ năng" || student.skills.includes(skill);
      const matchesGoal = !goal || goal === "Tất cả mục tiêu" || student.targetGrade === goal;
      const matchesStatus = !status || status === "Tất cả" || student.status === status;
      return matchesQuery && matchesSkill && matchesGoal && matchesStatus;
    });

    res.json(students);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await readStore();
    const student = data.students.find((item) => item.id === Number(req.params.id));
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const data = await readStore();
    const studentIndex = data.students.findIndex((item) => item.id === Number(req.params.id));
    if (studentIndex === -1) return res.status(404).json({ message: "Student not found" });

    const allowed = ["email", "major", "targetGrade", "commitmentHours", "skills", "bio", "github", "linkedin", "website"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    data.students[studentIndex] = { ...data.students[studentIndex], ...updates };
    await writeStore(data);

    res.json(data.students[studentIndex]);
  } catch (error) {
    next(error);
  }
});

export default router;
