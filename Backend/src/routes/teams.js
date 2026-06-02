import { Router } from "express";
import { z } from "zod";
import { readStore, serializeTeam, writeStore } from "../store.js";

const router = Router();

const createTeamSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  targetGrade: z.string().min(1),
  maxMembers: z.coerce.number().int().min(2).max(10),
  skills: z.array(z.string()).default([]),
  commitments: z.array(z.string()).default([]),
  leaderId: z.coerce.number().int().positive()
});

const joinRequestSchema = z.object({
  studentId: z.coerce.number().int().positive(),
  confirmedCommitments: z.array(z.string()).min(1),
  message: z.string().optional()
});

router.get("/", async (_req, res, next) => {
  try {
    const data = await readStore();
    res.json(data.teams.map((team) => serializeTeam(team, data.students)));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const payload = createTeamSchema.parse(req.body);
    const data = await readStore();
    const leader = data.students.find((student) => student.id === payload.leaderId);

    if (!leader) return res.status(404).json({ message: "Leader not found" });

    const team = {
      id: Math.max(0, ...data.teams.map((item) => item.id)) + 1,
      name: payload.name,
      description: payload.description,
      targetGrade: payload.targetGrade,
      maxMembers: payload.maxMembers,
      status: "RECRUITING",
      skills: payload.skills,
      commitments: payload.commitments,
      leaderId: payload.leaderId,
      memberIds: [payload.leaderId],
      createdAt: new Date().toISOString()
    };

    leader.status = "IN_TEAM";
    data.teams.push(team);
    await writeStore(data);

    res.status(201).json(serializeTeam(team, data.students));
  } catch (error) {
    next(error);
  }
});

router.post("/:id/join-requests", async (req, res, next) => {
  try {
    const payload = joinRequestSchema.parse(req.body);
    const data = await readStore();
    const teamId = Number(req.params.id);
    const team = data.teams.find((item) => item.id === teamId);
    const student = data.students.find((item) => item.id === payload.studentId);

    if (!team) return res.status(404).json({ message: "Team not found" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const existingIndex = data.joinRequests.findIndex((request) => request.teamId === teamId && request.studentId === payload.studentId);
    const joinRequest = {
      id: existingIndex === -1 ? Math.max(0, ...data.joinRequests.map((item) => item.id)) + 1 : data.joinRequests[existingIndex].id,
      teamId,
      studentId: payload.studentId,
      confirmedCommitments: payload.confirmedCommitments,
      message: payload.message ?? "",
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    if (existingIndex === -1) {
      data.joinRequests.push(joinRequest);
    } else {
      data.joinRequests[existingIndex] = joinRequest;
    }

    await writeStore(data);
    res.status(201).json({ ...joinRequest, team: serializeTeam(team, data.students), student });
  } catch (error) {
    next(error);
  }
});

export default router;
