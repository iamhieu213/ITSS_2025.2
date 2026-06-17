import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
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

const updateJoinRequestStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"])
});

const leaveTeamSchema = z.object({
  transferLeaderId: z.coerce.number().int().positive().optional()
});

const createInvitationSchema = z.object({
  studentId: z.coerce.number().int().positive()
});

const updateInvitationStatusSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED"])
});

// GET /api/teams
router.get("/", async (_req, res, next) => {
  try {
    const data = await readStore();
    res.json(data.teams.map((team) => serializeTeam(team, data.students)));
  } catch (error) {
    next(error);
  }
});

// GET /api/teams/invitations — phải đặt trước /:id để không bị conflict
router.get("/invitations", async (req, res, next) => {
  try {
    const data = await readStore();
    if (!Array.isArray(data.invitations)) data.invitations = [];

    const studentId = req.query.studentId ? Number(req.query.studentId) : null;
    const leaderId = req.query.leaderId ? Number(req.query.leaderId) : null;

    const invitations = data.invitations
      .filter((inv) => {
        if (studentId && inv.studentId !== studentId) return false;
        if (leaderId) {
          const team = data.teams.find((t) => t.id === inv.teamId);
          return team?.leaderId === leaderId;
        }
        return true;
      })
      .map((inv) => {
        const team = data.teams.find((t) => t.id === inv.teamId);
        const student = data.students.find((s) => s.id === inv.studentId);
        return {
          ...inv,
          team: team ? serializeTeam(team, data.students) : null,
          student
        };
      });

    res.json(invitations);
  } catch (error) {
    next(error);
  }
});

// GET /api/teams/join-requests
router.get("/join-requests", async (req, res, next) => {
  try {
    const data = await readStore();
    const studentId = req.query.studentId ? Number(req.query.studentId) : null;
    const leaderId = req.query.leaderId ? Number(req.query.leaderId) : null;
    const requests = data.joinRequests
      .filter((request) => {
        if (studentId && request.studentId !== studentId) return false;
        if (!leaderId) return true;
        const team = data.teams.find((item) => item.id === request.teamId);
        return team?.leaderId === leaderId;
      })
      .map((request) => {
        const team = data.teams.find((item) => item.id === request.teamId);
        const student = data.students.find((item) => item.id === request.studentId);
        return {
          ...request,
          team: team ? serializeTeam(team, data.students) : null,
          student
        };
      });

    res.json(requests);
  } catch (error) {
    next(error);
  }
});

// POST /api/teams
router.post("/", async (req, res, next) => {
  try {
    const payload = createTeamSchema.parse(req.body);
    const data = await readStore();
    const leader = data.students.find((student) => student.id === payload.leaderId);

    if (!leader) return res.status(404).json({ message: "Leader not found" });
    if (leader.status === "IN_TEAM") return res.status(409).json({ message: "Student already has a team" });

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

// POST /api/teams/:id/join-requests
router.post("/:id/join-requests", async (req, res, next) => {
  try {
    const payload = joinRequestSchema.parse(req.body);
    const data = await readStore();
    const teamId = Number(req.params.id);
    const team = data.teams.find((item) => item.id === teamId);
    const student = data.students.find((item) => item.id === payload.studentId);

    if (!team) return res.status(404).json({ message: "Team not found" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Enforce that a student already in a team cannot join another team
    if (student.status === "IN_TEAM") {
      return res.status(400).json({ message: "Bạn đã có nhóm, không thể xin gia nhập nhóm khác." });
    }

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

    team.memberIds = team.memberIds.filter((id) => id !== student.id);
    const isInAnotherTeam = data.teams.some((item) => item.id !== teamId && item.memberIds.includes(student.id));
    if (!isInAnotherTeam) {
      student.status = "LOOKING";
    }

    await writeStore(data);

    // Emit real-time notification to the team leader
    const io = req.app.get("io");
    if (io) {
      io.to(`student-${team.leaderId}`).emit("notification", {
        type: "JOIN_REQUEST",
        message: `Sinh viên ${student.name} đã gửi yêu cầu gia nhập nhóm "${team.name}" của bạn.`,
        studentId: student.id,
        teamId: team.id
      });
    }

    res.status(201).json({ ...joinRequest, team: serializeTeam(team, data.students), student });
  } catch (error) {
    next(error);
  }
});

// POST /api/teams/:id/invitations — Trưởng nhóm gửi lời mời
router.post("/:id/invitations", requireAuth, async (req, res, next) => {
  try {
    const payload = createInvitationSchema.parse(req.body);
    const data = await readStore();
    const teamId = Number(req.params.id);
    const team = data.teams.find((item) => item.id === teamId);

    if (!team) return res.status(404).json({ message: "Team not found" });
    if (team.leaderId !== req.studentId) {
      return res.status(403).json({ message: "Chỉ trưởng nhóm mới có thể gửi lời mời." });
    }

    const student = data.students.find((item) => item.id === payload.studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.status === "IN_TEAM") {
      return res.status(400).json({ message: "Sinh viên này đã có nhóm rồi." });
    }
    if (team.memberIds.includes(payload.studentId)) {
      return res.status(400).json({ message: "Sinh viên này đã là thành viên nhóm." });
    }
    if (team.memberIds.length >= team.maxMembers) {
      return res.status(400).json({ message: "Nhóm đã đầy, không thể mời thêm thành viên." });
    }

    if (!Array.isArray(data.invitations)) data.invitations = [];

    const existingIndex = data.invitations.findIndex(
      (inv) => inv.teamId === teamId && inv.studentId === payload.studentId && inv.status === "PENDING"
    );
    if (existingIndex !== -1) {
      return res.status(409).json({ message: "Đã có lời mời đang chờ phản hồi từ sinh viên này." });
    }

    const invitation = {
      id: Math.max(0, ...data.invitations.map((item) => item.id ?? 0)) + 1,
      teamId,
      studentId: payload.studentId,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    data.invitations.push(invitation);
    await writeStore(data);

    // Emit socket notification to the invited student
    const io = req.app.get("io");
    if (io) {
      io.to(`student-${payload.studentId}`).emit("notification", {
        type: "TEAM_INVITATION",
        message: `Trưởng nhóm "${team.name}" đã gửi lời mời gia nhập nhóm cho bạn.`,
        teamId: team.id
      });
    }

    res.status(201).json({ ...invitation, team: serializeTeam(team, data.students), student });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/teams/invitations/:inviteId/status — Sinh viên chấp nhận hoặc từ chối
router.patch("/invitations/:inviteId/status", requireAuth, async (req, res, next) => {
  try {
    const payload = updateInvitationStatusSchema.parse(req.body);
    const data = await readStore();
    if (!Array.isArray(data.invitations)) data.invitations = [];

    const inviteId = Number(req.params.inviteId);
    const invIndex = data.invitations.findIndex((inv) => inv.id === inviteId);
    if (invIndex === -1) return res.status(404).json({ message: "Invitation not found" });

    const invitation = data.invitations[invIndex];
    if (invitation.studentId !== req.studentId) {
      return res.status(403).json({ message: "Bạn không có quyền phản hồi lời mời này." });
    }
    if (invitation.status !== "PENDING") {
      return res.status(400).json({ message: "Lời mời này đã được xử lý rồi." });
    }

    const team = data.teams.find((t) => t.id === invitation.teamId);
    const student = data.students.find((s) => s.id === invitation.studentId);

    if (!team) return res.status(404).json({ message: "Team not found" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    invitation.status = payload.status;
    invitation.respondedAt = new Date().toISOString();

    if (payload.status === "ACCEPTED") {
      if (student.status === "IN_TEAM") {
        return res.status(400).json({ message: "Bạn đã có nhóm, không thể chấp nhận lời mời này." });
      }
      if (team.memberIds.length >= team.maxMembers) {
        return res.status(400).json({ message: "Nhóm đã đầy, không thể tham gia." });
      }

      if (!team.memberIds.includes(student.id)) {
        team.memberIds.push(student.id);
      }
      student.status = "IN_TEAM";

      // Cancel all other pending invitations for this student
      data.invitations = data.invitations.map((inv) =>
        inv.studentId === student.id && inv.id !== inviteId && inv.status === "PENDING"
          ? { ...inv, status: "DECLINED", respondedAt: new Date().toISOString() }
          : inv
      );
      data.invitations[invIndex] = invitation;
    }

    await writeStore(data);

    // Notify team leader
    const io = req.app.get("io");
    if (io) {
      const statusText = payload.status === "ACCEPTED" ? "chấp nhận" : "từ chối";
      io.to(`student-${team.leaderId}`).emit("notification", {
        type: "INVITATION_RESPONSE",
        status: payload.status,
        message: `${student.name} đã ${statusText} lời mời vào nhóm "${team.name}".`,
        teamId: team.id
      });
    }

    res.json({ ...invitation, team: serializeTeam(team, data.students), student });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/teams/:id/leave
router.patch("/:id/leave", requireAuth, async (req, res, next) => {
  try {
    const payload = leaveTeamSchema.parse(req.body);
    const data = await readStore();
    const teamId = Number(req.params.id);
    const teamIndex = data.teams.findIndex((item) => item.id === teamId);

    if (teamIndex === -1) return res.status(404).json({ message: "Team not found" });

    const team = data.teams[teamIndex];
    const student = data.students.find((item) => item.id === req.studentId);

    if (!team.memberIds.includes(req.studentId)) {
      return res.status(403).json({ message: "Bạn không phải là thành viên của nhóm này." });
    }

    const isLeader = team.leaderId === req.studentId;
    const remainingMemberIds = team.memberIds.filter((id) => id !== req.studentId);

    if (isLeader && remainingMemberIds.length > 0) {
      if (!payload.transferLeaderId) {
        return res.status(400).json({ message: "Trưởng nhóm cần chọn người nhận chức trưởng nhóm trước khi rời nhóm." });
      }

      if (!remainingMemberIds.includes(payload.transferLeaderId)) {
        return res.status(400).json({ message: "Người nhận chức trưởng nhóm phải là thành viên còn lại trong nhóm." });
      }

      team.leaderId = payload.transferLeaderId;
    }

    team.memberIds = remainingMemberIds;
    if (student) student.status = "LOOKING";

    if (!team.memberIds.length) {
      data.teams.splice(teamIndex, 1);
      data.joinRequests = data.joinRequests.filter((request) => request.teamId !== teamId);
      if (Array.isArray(data.invitations)) {
        data.invitations = data.invitations.filter((inv) => inv.teamId !== teamId);
      }
      await writeStore(data);
      return res.json({ message: "Bạn đã rời nhóm. Nhóm không còn thành viên nên đã được xóa.", team: null });
    }

    await writeStore(data);
    res.json(serializeTeam(team, data.students));
  } catch (error) {
    next(error);
  }
});

// DELETE /api/teams/:id
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const data = await readStore();
    const teamId = Number(req.params.id);
    const teamIndex = data.teams.findIndex((item) => item.id === teamId);

    if (teamIndex === -1) return res.status(404).json({ message: "Team not found" });

    const team = data.teams[teamIndex];
    if (team.leaderId !== req.studentId) {
      return res.status(403).json({ message: "Chỉ trưởng nhóm mới có thể xóa nhóm." });
    }

    for (const memberId of team.memberIds) {
      const member = data.students.find((student) => student.id === memberId);
      if (member) member.status = "LOOKING";
    }

    data.teams.splice(teamIndex, 1);
    data.joinRequests = data.joinRequests.filter((request) => request.teamId !== teamId);
    if (Array.isArray(data.invitations)) {
      data.invitations = data.invitations.filter((inv) => inv.teamId !== teamId);
    }
    await writeStore(data);

    res.json({ message: "Đã xóa nhóm thành công." });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/teams/join-requests/:requestId/status
router.patch("/join-requests/:requestId/status", async (req, res, next) => {
  try {
    const payload = updateJoinRequestStatusSchema.parse(req.body);
    const data = await readStore();
    const requestId = Number(req.params.requestId);
    const requestIndex = data.joinRequests.findIndex((request) => request.id === requestId);

    if (requestIndex === -1) return res.status(404).json({ message: "Join request not found" });

    const request = data.joinRequests[requestIndex];
    const team = data.teams.find((item) => item.id === request.teamId);
    const student = data.students.find((item) => item.id === request.studentId);

    if (!team) return res.status(404).json({ message: "Team not found" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    request.status = payload.status;
    request.reviewedAt = new Date().toISOString();

    if (payload.status === "APPROVED") {
      // Check if student is already in another team
      if (student.status === "IN_TEAM") {
        return res.status(400).json({ message: "Sinh viên này đã có nhóm khác rồi, không thể duyệt." });
      }

      if (!team.memberIds.includes(student.id)) {
        team.memberIds.push(student.id);
      }
      student.status = "IN_TEAM";

      // Auto-delete all other join requests of this student
      data.joinRequests = data.joinRequests.filter((r) => r.studentId !== student.id || r.id === requestId);
    }

    if (payload.status === "REJECTED") {
      team.memberIds = team.memberIds.filter((id) => id !== student.id);
      const isInAnotherTeam = data.teams.some((item) => item.memberIds.includes(student.id));
      if (!isInAnotherTeam) {
        student.status = "LOOKING";
      }
    }

    await writeStore(data);

    // Emit real-time notification to the requesting student
    const io = req.app.get("io");
    if (io) {
      const statusText = payload.status === "APPROVED" ? "DUYỆT" : "TỪ CHỐI";
      io.to(`student-${request.studentId}`).emit("notification", {
        type: "REQUEST_STATUS_UPDATE",
        status: payload.status,
        message: `Yêu cầu gia nhập nhóm "${team.name}" của bạn đã được ${statusText}.`,
        teamId: team.id
      });
    }

    res.json({ ...request, team: serializeTeam(team, data.students), student });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/teams/join-requests/:requestId
router.delete("/join-requests/:requestId", requireAuth, async (req, res, next) => {
  try {
    const data = await readStore();
    const requestId = Number(req.params.requestId);
    const requestIndex = data.joinRequests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({ message: "Yêu cầu gia nhập không tồn tại." });
    }

    const request = data.joinRequests[requestIndex];

    // Ensure they can only delete their own request
    if (request.studentId !== req.studentId) {
      return res.status(403).json({ message: "Bạn không có quyền hủy yêu cầu này." });
    }

    // A student cannot leave if the request is already approved (in the team)
    if (request.status === "APPROVED") {
      return res.status(403).json({ message: "Yêu cầu đã được duyệt, bạn đã là thành viên của nhóm này và không thể rời." });
    }

    data.joinRequests.splice(requestIndex, 1);
    await writeStore(data);

    res.json({ message: "Đã hủy yêu cầu gia nhập nhóm thành công." });
  } catch (error) {
    next(error);
  }
});

export default router;
