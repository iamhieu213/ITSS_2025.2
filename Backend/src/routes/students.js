import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { readStore, writeStore } from "../store.js";

const router = Router();

const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  content: z.string().trim().max(500).optional().default("")
});

function withoutPassword(student) {
  if (!student) return student;
  const { password, ...safeStudent } = student;
  return safeStudent;
}

function recalculateRating(student) {
  const reviews = student.reviews ?? [];
  if (!reviews.length) {
    student.rating = 5;
    student.ratingCount = 0;
    return;
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.rating ?? 0), 0);
  student.rating = Number((total / reviews.length).toFixed(1));
  student.ratingCount = reviews.length;
}

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

    res.json(students.map(withoutPassword));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await readStore();
    const student = data.students.find((item) => item.id === Number(req.params.id));
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(withoutPassword(student));
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

router.post("/:id/reviews", requireAuth, async (req, res, next) => {
  try {
    const payload = reviewSchema.parse(req.body);
    const data = await readStore();
    const targetId = Number(req.params.id);
    const reviewerId = req.studentId;

    if (targetId === reviewerId) {
      return res.status(400).json({ message: "Bạn không thể tự đánh giá chính mình." });
    }

    const target = data.students.find((item) => item.id === targetId);
    const reviewer = data.students.find((item) => item.id === reviewerId);

    if (!target) return res.status(404).json({ message: "Student not found" });
    if (!reviewer) return res.status(404).json({ message: "Reviewer not found" });

    const sharedTeam = data.teams.find((team) =>
      team.memberIds.includes(targetId) && team.memberIds.includes(reviewerId)
    );

    if (!sharedTeam) {
      return res.status(403).json({ message: "Bạn chỉ có thể đánh giá thành viên trong nhóm của mình." });
    }

    target.reviews = target.reviews ?? [];
    const now = new Date().toISOString();
    const existingIndex = target.reviews.findIndex(
      (review) => review.reviewerId === reviewerId && review.teamId === sharedTeam.id
    );

    const review = {
      id: existingIndex === -1 ? Math.max(0, ...target.reviews.map((item) => item.id ?? 0)) + 1 : target.reviews[existingIndex].id,
      teamId: sharedTeam.id,
      teamName: sharedTeam.name,
      reviewerId,
      reviewerName: reviewer.name,
      content: payload.content,
      rating: payload.rating,
      createdAt: existingIndex === -1 ? now : target.reviews[existingIndex].createdAt,
      updatedAt: now
    };

    if (existingIndex === -1) {
      target.reviews.push(review);
    } else {
      target.reviews[existingIndex] = review;
    }

    recalculateRating(target);
    await writeStore(data);

    res.status(existingIndex === -1 ? 201 : 200).json(withoutPassword(target));
  } catch (error) {
    next(error);
  }
});

export default router;
