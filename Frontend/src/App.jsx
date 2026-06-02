import React, { useEffect, useState } from "react";
import { api } from "./api.js";
import JoinCommitmentModal from "./components/JoinCommitmentModal.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import CreateTeamPage from "./pages/CreateTeamPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import MyTeamPage from "./pages/MyTeamPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { allGoalsValue, allSkillsValue, allStatusesValue } from "./constants/studymates.js";

const defaultFilters = {
  query: "",
  skill: allSkillsValue,
  goal: allGoalsValue,
  status: allStatusesValue
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [profile, setProfile] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);
  const [joiningGroup, setJoiningGroup] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(defaultFilters);

  async function loadBase() {
    setError("");
    try {
      const [classroomData, teamData, profileData] = await Promise.all([api.getClassroom(), api.getTeams(), api.getProfile()]);
      const requestData = await api.getJoinRequests(profileData.id);
      setClassroom(classroomData);
      setTeams(teamData);
      setProfile(profileData);
      setJoinRequests(requestData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const data = await api.getStudents({
          query: filters.query,
          skill: filters.skill === allSkillsValue ? "" : filters.skill,
          goal: filters.goal === allGoalsValue ? "" : filters.goal,
          status: filters.status === allStatusesValue ? "" : filters.status
        });
        setStudents(data);
      } catch (err) {
        setError(err.message);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!error) return undefined;
    const timer = setTimeout(() => setError(""), 6000);
    return () => clearTimeout(timer);
  }, [error]);

  async function submitJoinRequest(teamId, payload) {
    try {
      const request = await api.createJoinRequest(teamId, payload);
      const requestData = await api.getJoinRequests(payload.studentId);
      setJoinRequests(requestData);
      setJoiningGroup(null);
      setNotice(request.status === "PENDING" ? "Đã gửi yêu cầu gia nhập nhóm." : "Đã cập nhật yêu cầu gia nhập nhóm.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function refreshAfterTeamCreated() {
    await loadBase();
    setActivePage("my-team");
    setNotice("Đã tạo nhóm mới.");
  }

  function handleProfileSaved(updated) {
    setProfile(updated);
    setNotice("Đã lưu hồ sơ.");
  }

  function handleInviteStudent(student) {
    if (student.status !== "LOOKING") {
      setError(`${student.name} đã có nhóm, không thể mời.`);
      return;
    }

    setNotice(`Đã gửi lời mời vào nhóm cho ${student.name}.`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage={activePage} onNavigate={setActivePage} profile={profile} />
        <div className="min-w-0 flex-1">
          <Topbar classroom={classroom} onMenu={() => setSidebarOpen(true)} />
          {error ? <div className="mx-auto mt-4 max-w-[1280px] rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
          {notice ? <div className="mx-auto mt-4 max-w-[1280px] rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</div> : null}

          {activePage === "dashboard" ? <DashboardPage classroom={classroom} students={students} teams={teams} filters={filters} setFilters={setFilters} onJoinGroup={setJoiningGroup} onInviteStudent={handleInviteStudent} /> : null}
          {activePage === "my-team" ? <MyTeamPage profile={profile} teams={teams} joinRequests={joinRequests} onFindTeam={() => setActivePage("dashboard")} onCreateTeam={() => setActivePage("create-team")} onJoinGroup={setJoiningGroup} /> : null}
          {activePage === "create-team" && profile ? <CreateTeamPage profile={profile} onCancel={() => setActivePage("my-team")} onCreated={refreshAfterTeamCreated} /> : null}
          {activePage === "profile" ? <ProfilePage profile={profile} onSaved={handleProfileSaved} /> : null}
        </div>
      </div>

      {joiningGroup ? <JoinCommitmentModal group={joiningGroup} profile={profile} onSubmit={submitJoinRequest} onClose={() => setJoiningGroup(null)} /> : null}
    </div>
  );
}
