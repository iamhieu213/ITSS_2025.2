import { Router } from "express";
import { readStore } from "../store.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const data = await readStore();
    const totalStudents = data.students.length;
    const studentsInTeam = data.students.filter((student) => student.status === "IN_TEAM").length;

    res.json({
      ...data.classroom,
      stats: {
        totalStudents,
        studentsInTeam,
        studentsWithoutTeam: totalStudents - studentsInTeam,
        totalTeams: data.teams.length
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
