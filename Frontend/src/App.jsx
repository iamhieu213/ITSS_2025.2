import React, { useEffect, useMemo, useState, useRef } from "react";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { api } from "./api.js";
import JoinCommitmentModal from "./components/JoinCommitmentModal.jsx";
import Sidebar from "./components/Sidebar.jsx";
import StudentDetailModal from "./components/StudentDetailModal.jsx";
import Topbar from "./components/Topbar.jsx";
import { allGoalsValue, allSkillsValue, allStatusesValue } from "./constants/studymates.js";
import CreateTeamPage from "./pages/CreateTeamPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import MyTeamPage from "./pages/MyTeamPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const defaultFilters = {
  query: "",
  skill: allSkillsValue,
  goal: allGoalsValue,
  status: allStatusesValue
};

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:4000";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  }
});

function getInitialPage() {
  const page = new URLSearchParams(window.location.search).get("page");
  return page || "dashboard";
}

export default function App() {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem("token");
    return t === "undefined" || t === "null" ? null : t;
  });
  const socketRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState(getInitialPage);
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [profile, setProfile] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [joiningGroup, setJoiningGroup] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  async function loadRequestsForProfile(profileData) {
    if (profileData.status === "IN_TEAM") {
      return api.getJoinRequests({ leaderId: profileData.id });
    }

    return api.getJoinRequests({ studentId: profileData.id });
  }

  async function loadBase() {
    if (!token) return;
    try {
      const [classroomData, teamData, profileData] = await Promise.all([
        api.getClassroom(),
        api.getTeams(),
        api.getProfile()
      ]);
      const requestData = await loadRequestsForProfile(profileData);
      setClassroom(classroomData);
      setTeams(teamData);
      setProfile(profileData);
      setJoinRequests(requestData);
    } catch (err) {
      if (err.message.includes("Unauthorized") || err.message.includes("401") || err.message.includes("not found") || err.message.includes("404")) {
        handleLogout();
      } else {
        Swal.fire({
          title: "Lỗi tải dữ liệu",
          text: err.message,
          icon: "error",
          confirmButtonColor: "#ef4444"
        });
      }
    }
  }

  async function loadStudentsForCurrentFilters() {
    const data = await api.getStudents({
      query: filters.query,
      skill: filters.skill === allSkillsValue ? "" : filters.skill,
      goal: filters.goal === allGoalsValue ? "" : filters.goal,
      status: filters.status === allStatusesValue ? "" : filters.status
    });
    setStudents(data);
    return data;
  }

  useEffect(() => {
    if (token) {
      loadBase();
    } else {
      if (activePage !== "register") {
        setActivePage("login");
      }
    }
  }, [token]);

  useEffect(() => {
    if (token && profile) {
      const socket = io(SOCKET_URL);
      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("[Socket] Connected to server, joining student room:", profile.id);
        socket.emit("join-student-room", profile.id);
      });

      socket.on("notification", (data) => {
        console.log("[Socket] Received notification:", data);
        Swal.fire({
          title: "Thông báo mới!",
          text: data.message,
          icon: "info",
          confirmButtonColor: "#2563eb"
        });
        loadBase();
      });

      return () => {
        console.log("[Socket] Disconnecting socket client");
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [token, profile]);

  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(async () => {
      try {
        await loadStudentsForCurrentFilters();
      } catch (err) {
        Toast.fire({
          icon: "error",
          title: err.message
        });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [filters, token]);

  function handleAuthSuccess(student) {
    setToken(localStorage.getItem("token"));
    setProfile(student);
    setActivePage("dashboard");
    Toast.fire({
      icon: "success",
      title: "Đăng nhập thành công!"
    });
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setProfile(null);
    setActivePage("login");
  }

  async function submitJoinRequest(teamId, payload) {
    try {
      const request = await api.createJoinRequest(teamId, payload);
      const requestData = await api.getJoinRequests({ studentId: payload.studentId });
      setJoinRequests(requestData);
      setJoiningGroup(null);
      Swal.fire({
        title: "Gửi yêu cầu thành công!",
        text: request.status === "PENDING" ? "Đã gửi yêu cầu gia nhập nhóm." : "Đã cập nhật yêu cầu gia nhập nhóm.",
        icon: "success",
        confirmButtonColor: "#2563eb"
      });
    } catch (err) {
      Swal.fire({
        title: "Lỗi gửi yêu cầu",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  }

  async function refreshAfterTeamCreated() {
    await loadBase();
    setActivePage("my-team");
    Swal.fire({
      title: "Tạo nhóm thành công!",
      text: "Nhóm học tập của bạn đã được khởi tạo.",
      icon: "success",
      confirmButtonColor: "#2563eb"
    });
  }

  function goToCreateTeam() {
    if (profile?.status === "IN_TEAM") {
      Swal.fire({
        title: "Không khả thi",
        text: "Bạn đã có nhóm, không thể tạo nhóm mới.",
        icon: "warning",
        confirmButtonColor: "#eab308"
      });
      return;
    }

    setActivePage("create-team");
  }

  function handleProfileSaved(updated) {
    setProfile(updated);
    Toast.fire({
      icon: "success",
      title: "Đã lưu hồ sơ thành công!"
    });
  }

  function handleInviteStudent(student) {
    if (student.id === profile?.id) {
      Swal.fire({
        title: "Không khả thi",
        text: "Bạn không thể tự mời chính mình vào nhóm.",
        icon: "warning",
        confirmButtonColor: "#eab308"
      });
      return;
    }

    if (student.status !== "LOOKING") {
      Swal.fire({
        title: "Không khả thi",
        text: `${student.name} đã có nhóm, không thể mời.`,
        icon: "warning",
        confirmButtonColor: "#eab308"
      });
      return;
    }

    Toast.fire({
      icon: "success",
      title: `Đã gửi lời mời vào nhóm cho ${student.name}.`
    });
  }

  async function handleViewStudent(student) {
    try {
      const freshStudent = await api.getStudent(student.id);
      setSelectedStudent(freshStudent);
    } catch (err) {
      Swal.fire({
        title: "Không thể mở hồ sơ",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  }

  async function handleReviewMember(member) {
    try {
      const result = await Swal.fire({
        title: `Đánh giá ${member.name}`,
        html: `
          <div style="text-align:left">
            <label for="review-rating" style="display:block;margin-bottom:6px;font-size:13px;font-weight:700;color:#334155">Số sao</label>
            <select id="review-rating" class="swal2-input" style="width:100%;margin:0 0 14px 0">
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
            <label for="review-content" style="display:block;margin-bottom:6px;font-size:13px;font-weight:700;color:#334155">Nhận xét</label>
            <textarea id="review-content" class="swal2-textarea" maxlength="500" placeholder="Nhập nhận xét của bạn..." style="width:100%;min-height:110px;margin:0"></textarea>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Gửi đánh giá",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#2563eb",
        preConfirm: () => {
          const rating = Number(document.getElementById("review-rating")?.value ?? 5);
          const content = document.getElementById("review-content")?.value.trim() ?? "";
          return { rating, content };
        }
      });

      if (!result.isConfirmed) return;

      const updatedStudent = await api.createStudentReview(member.id, result.value);
      await loadBase();
      await loadStudentsForCurrentFilters();
      setSelectedStudent((current) => current?.id === member.id ? updatedStudent : current);
      Toast.fire({
        icon: "success",
        title: "Đã gửi đánh giá thành viên."
      });
    } catch (err) {
      Swal.fire({
        title: "Lỗi đánh giá",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  }

  async function handleLeaveTeam(team) {
    try {
      const isLeader = team.leaderId === profile?.id;
      const remainingMembers = (team.members ?? []).filter((member) => member.id !== profile?.id);
      let payload = {};

      if (isLeader && remainingMembers.length > 0) {
        const inputOptions = Object.fromEntries(remainingMembers.map((member) => [member.id, `${member.name} (${member.studentCode})`]));
        const result = await Swal.fire({
          title: "Chọn trưởng nhóm mới",
          text: "Bạn cần chuyển quyền trưởng nhóm trước khi rời nhóm.",
          input: "select",
          inputOptions,
          inputPlaceholder: "Chọn thành viên",
          showCancelButton: true,
          confirmButtonText: "Rời nhóm",
          cancelButtonText: "Hủy",
          confirmButtonColor: "#2563eb",
          inputValidator: (value) => value ? undefined : "Vui lòng chọn người nhận chức trưởng nhóm."
        });

        if (!result.isConfirmed) return;
        payload = { transferLeaderId: Number(result.value) };
      } else {
        const result = await Swal.fire({
          title: "Rời nhóm?",
          text: "Bạn sẽ trở về trạng thái tìm nhóm sau khi rời.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Rời nhóm",
          cancelButtonText: "Hủy",
          confirmButtonColor: "#2563eb",
          cancelButtonColor: "#ef4444"
        });

        if (!result.isConfirmed) return;
      }

      await api.leaveTeam(team.id, payload);
      await loadBase();
      await loadStudentsForCurrentFilters();
      Swal.fire({
        title: "Đã rời nhóm",
        text: "Thông tin nhóm của bạn đã được cập nhật.",
        icon: "success",
        confirmButtonColor: "#2563eb"
      });
    } catch (err) {
      Swal.fire({
        title: "Không thể rời nhóm",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  }

  async function handleDeleteTeam(team) {
    try {
      const result = await Swal.fire({
        title: "Xóa nhóm?",
        text: `Nhóm "${team.name}" sẽ bị xóa và các thành viên sẽ trở về trạng thái tìm nhóm.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa nhóm",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b"
      });

      if (!result.isConfirmed) return;

      await api.deleteTeam(team.id);
      await loadBase();
      await loadStudentsForCurrentFilters();
      Swal.fire({
        title: "Đã xóa nhóm",
        text: "Nhóm đã được xóa thành công.",
        icon: "success",
        confirmButtonColor: "#2563eb"
      });
    } catch (err) {
      Swal.fire({
        title: "Không thể xóa nhóm",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  }

  async function handleUpdateJoinRequestStatus(requestId, status) {
    try {
      await api.updateJoinRequestStatus(requestId, status);
      await loadBase();
      Swal.fire({
        title: "Thực hiện thành công!",
        text: status === "APPROVED" ? "Đã duyệt yêu cầu tham gia nhóm." : "Đã từ chối yêu cầu tham gia nhóm.",
        icon: "success",
        confirmButtonColor: "#2563eb"
      });
    } catch (err) {
      Swal.fire({
        title: "Lỗi xử lý",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  }

  async function handleCancelJoinRequest(requestId) {
    try {
      const result = await Swal.fire({
        title: "Xác nhận hủy?",
        text: "Bạn có chắc chắn muốn hủy yêu cầu gia nhập nhóm này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ"
      });

      if (result.isConfirmed) {
        await api.deleteJoinRequest(requestId);
        await loadBase();
        Swal.fire({
          title: "Đã hủy!",
          text: "Yêu cầu của bạn đã được rút lại thành công.",
          icon: "success",
          confirmButtonColor: "#2563eb"
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Lỗi",
        text: err.message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
  }

  if (!token) {
    if (activePage === "register") {
      return (
        <Register
          onRegisterSuccess={handleAuthSuccess}
          onNavigateToLogin={() => setActivePage("login")}
        />
      );
    }
    return (
      <Login
        onLoginSuccess={handleAuthSuccess}
        onNavigateToRegister={() => setActivePage("register")}
      />
    );
  }

  if (token && !profile) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-500 font-semibold text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          Đang tải dữ liệu tài khoản...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage={activePage} onNavigate={setActivePage} profile={profile} onLogout={handleLogout} />
      <div className="min-w-0 lg:pl-72">
        <Topbar classroom={classroom} onMenu={() => setSidebarOpen(true)} />

        {activePage === "dashboard" ? (
          <DashboardPage
            classroom={classroom}
            students={students}
            teams={teams}
            filters={filters}
            setFilters={setFilters}
            currentStudentId={profile?.id}
            isStudentInTeam={profile?.status === "IN_TEAM"}
            joinRequests={joinRequests}
            onJoinGroup={setJoiningGroup}
            onInviteStudent={handleInviteStudent}
            onViewStudent={handleViewStudent}
          />
        ) : null}
        {activePage === "my-team" ? (
          <MyTeamPage
            profile={profile}
            teams={teams}
            joinRequests={joinRequests}
            onFindTeam={() => setActivePage("dashboard")}
            onCreateTeam={goToCreateTeam}
            onJoinGroup={setJoiningGroup}
            onUpdateJoinRequestStatus={handleUpdateJoinRequestStatus}
            onCancelJoinRequest={handleCancelJoinRequest}
            onViewStudent={handleViewStudent}
            onReviewMember={handleReviewMember}
            onLeaveTeam={handleLeaveTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        ) : null}
        {activePage === "create-team" && profile && profile.status !== "IN_TEAM" ? <CreateTeamPage profile={profile} onCancel={() => setActivePage("my-team")} onCreated={refreshAfterTeamCreated} /> : null}
        {activePage === "profile" ? <ProfilePage profile={profile} onSaved={handleProfileSaved} /> : null}
      </div>

      {joiningGroup ? <JoinCommitmentModal group={joiningGroup} profile={profile} onSubmit={submitJoinRequest} onClose={() => setJoiningGroup(null)} /> : null}
      {selectedStudent ? <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} /> : null}
    </div>
  );
}
