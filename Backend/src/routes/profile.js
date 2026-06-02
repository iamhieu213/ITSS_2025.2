import { Router } from "express";
import { readStore } from "../store.js";

const router = Router();

router.get("/me", async (_req, res, next) => {
  try {
    const data = await readStore();
    const student = data.students.find((item) => item.studentCode === "20211013");
    if (!student) return res.status(404).json({ message: "Profile not found" });
    res.json(student);
  } catch (error) {
    next(error);
  }
});

export default router;
