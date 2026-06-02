import {
  Bell,
  BookOpen,
  Clock3,
  Crown,
  Filter,
  Github,
  Globe,
  GraduationCap,
  Grid2X2,
  Linkedin,
  Menu,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Target,
  User,
  UserCheck,
  UserPlus,
  Users,
  X
} from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";

const allSkills = [
  "Tat ca ky nang",
  "Giao tiếp",
  "Giao tiep",
  "Teamwork",
  "Chủ động",
  "Chu dong",
  "Trách nhiệm",
  "Trach nhiem",
  "Quản lý thời gian",
  "Quan ly thoi gian",
  "Hỗ trợ nhóm",
  "Ho tro nhom",
  "Thuyết trình",
  "Thuyet trinh",
  "Leadership",
  "Giải quyết vấn đề",
  "Giai quyet van de"
];
const goals = ["Tat ca muc tieu", "A+", "A", "B+"];
const statuses = ["Tat ca", "LOOKING", "IN_TEAM"];
const defaultCommitments = ["Hop dung gio", "Hoan thanh task dung han", "Chu dong trao doi", "Ton trong thanh vien"];

function statusLabel(status) {
  return status === "IN_TEAM" ? "Da co nhom" : "Dang tim nhom";
}

function Badge({ children, tone = "blue" }) {
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    orange: "border-amber-200 bg-amber-50 text-amber-700",
    gray: "border-slate-200 bg-slate-50 text-slate-600"
  };

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}

function Sidebar({ open, onClose, activePage, onNavigate, profile }) {
  const navItems = [
    { label: "Dashboard", page: "dashboard", icon: Grid2X2 },
    { label: "My Team", page: "my-team", icon: Users },
    { label: "Profile", page: "profile", icon: User }
  ];

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-slate-950/30 lg:hidden ${open ? "block" : "hidden"}`} onClick={onClose} />
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-slate-200 bg-white transition lg:static lg:translate-x-0 ${open ? "translate-x-0" : ""}`}>
        <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-950">StudyMates</div>
              <div className="text-xs text-slate-500">Tim nhom hoc tap</div>
            </div>
          </div>
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {profile ? (
          <div className="border-b border-slate-200 px-4 py-5">
            <div className="flex items-center gap-3">
              <img src={profile.avatar} alt={profile.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-200" />
              <div>
                <div className="font-bold text-slate-950">{profile.name}</div>
                <div className="text-xs text-slate-500">{profile.studentCode}</div>
              </div>
            </div>
            <div className="mt-4">
              <Badge tone={profile.status === "IN_TEAM" ? "green" : "blue"}>{statusLabel(profile.status)}</Badge>
            </div>
          </div>
        ) : null}

        <nav className="flex-1 space-y-2 px-4 py-4">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                onClose();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${activePage === item.page ? "bg-blue-100 text-blue-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button onClick={() => onNavigate("create-team")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
            <UserPlus size={18} />
            Tao nhom
          </button>
        </div>
      </aside>
    </>
  );
}

function Topbar({ classroom, onMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden" onClick={onMenu}>
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-base font-bold text-slate-950 sm:text-lg">{classroom?.name ?? "StudyMates"}</h1>
              <span className="hidden text-slate-400 sm:inline">- {classroom?.code ?? "SSH1151"}</span>
              <Badge tone="gray">{classroom?.semester ?? "Hoc ky"}</Badge>
            </div>
            <p className="mt-1 hidden text-xs text-slate-500 sm:block">Giang vien: {classroom?.lecturer ?? "Dang tai"}</p>
          </div>
        </div>
        <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}

function StatCard({ label, value, tone, icon: Icon }) {
  const tones = {
    blue: "from-blue-50 to-blue-100 text-blue-700",
    green: "from-emerald-50 to-teal-100 text-emerald-700",
    orange: "from-amber-50 to-orange-100 text-amber-800"
  };

  return (
    <article className={`rounded-2xl bg-gradient-to-br p-5 shadow-sm ring-1 ring-slate-200/70 ${tones[tone]}`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold opacity-80">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-normal">{value}</p>
        </div>
        <Icon size={42} className="opacity-35" />
      </div>
    </article>
  );
}

function Filters({ filters, setFilters }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
        <Filter size={16} />
        Bo loc
      </div>
      <div className="grid gap-3">
        <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
          <Search size={17} className="text-slate-400" />
          <input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} className="w-full text-sm outline-none" placeholder="Ten hoac MSSV..." />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <select value={filters.skill} onChange={(event) => setFilters({ ...filters, skill: event.target.value })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none">
            {allSkills.map((skill) => <option key={skill}>{skill}</option>)}
          </select>
          <select value={filters.goal} onChange={(event) => setFilters({ ...filters, goal: event.target.value })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none">
            {goals.map((goal) => <option key={goal}>{goal}</option>)}
          </select>
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none">
            {statuses.map((status) => <option key={status} value={status}>{status === "LOOKING" ? "Dang tim nhom" : status === "IN_TEAM" ? "Da co nhom" : status}</option>)}
          </select>
        </div>
      </div>
    </section>
  );
}

function StudentCard({ student }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img src={student.avatar} alt={student.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-950">{student.name}</h3>
            <p className="text-xs text-slate-500">{student.studentCode}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
              <span className="flex items-center gap-1 text-amber-600"><Star size={14} fill="currentColor" /> {student.rating}</span>
              <span className="flex items-center gap-1"><Target size={14} /> {student.targetGrade}</span>
              <span className="flex items-center gap-1"><Clock3 size={14} /> {student.commitmentHours}</span>
            </div>
          </div>
        </div>
        <Badge tone={student.status === "IN_TEAM" ? "green" : "blue"}>{statusLabel(student.status)}</Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(student.skills ?? []).map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{skill}</span>)}
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{student.bio}</p>
    </article>
  );
}

function GroupCard({ group, onJoin }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{group.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <Crown size={14} className="text-amber-500" />
            {group.leader?.name ?? "Chua co truong nhom"}
          </p>
        </div>
        <Badge tone={group.isNearlyFull ? "orange" : "blue"}>{group.status}</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{group.description}</p>
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex -space-x-2">
          {(group.members ?? []).slice(0, 5).map((member) => (
            <img key={member.id} src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full border-2 border-white object-cover" />
          ))}
        </div>
        <span className="flex items-center gap-1 text-xs text-slate-600"><Users size={14} /> {group.capacity}</span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
        <Target size={14} />
        Muc tieu: <strong className="text-slate-950">{group.targetGrade}</strong>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(group.skills ?? []).map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{skill}</span>)}
      </div>
      <button onClick={() => onJoin(group)} className="mt-4 h-11 w-full rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm hover:bg-blue-700">
        Xin gia nhap
      </button>
    </article>
  );
}

function JoinCommitmentModal({ group, profile, onSubmit, onClose }) {
  const commitments = group.commitments?.length ? group.commitments : defaultCommitments;
  const [checked, setChecked] = useState([]);
  const [message, setMessage] = useState("");

  function toggleCommitment(label) {
    setChecked((current) => (current.includes(label) ? current.filter((item) => item !== label) : [...current, label]));
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/75 px-4 py-6">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-100 text-blue-600">
            <ShieldCheck size={24} />
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <h2 className="mt-3 text-lg font-black text-slate-950">Cam ket trach nhiem</h2>
        <p className="mt-1 text-sm text-slate-600"><strong className="text-slate-950">{group.name}</strong> - Truong nhom: {group.leader?.name}</p>
        <div className="mt-4 space-y-3">
          {commitments.map((label) => {
            const isChecked = checked.includes(label);
            return (
              <button key={label} onClick={() => toggleCommitment(label)} className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-3 text-left text-sm font-semibold ${isChecked ? "border-blue-300 bg-blue-50 text-slate-950" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${isChecked ? "border-blue-600 bg-blue-600 text-white" : "border-blue-500 text-transparent"}`}><ShieldCheck size={12} /></span>
                {label}
              </button>
            );
          })}
        </div>
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="mt-4 min-h-20 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Loi nhan cho truong nhom..." />
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50">Huy</button>
          <button
            onClick={() => onSubmit(group.id, { studentId: profile.id, confirmedCommitments: checked, message })}
            disabled={!profile || checked.length < commitments.length}
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Xac nhan
          </button>
        </div>
      </section>
    </div>
  );
}

function DashboardPage({ classroom, students, teams, filters, setFilters, onJoinGroup }) {
  const stats = classroom?.stats ?? {};

  return (
    <main className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[1280px]">
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-normal text-slate-950 sm:text-3xl">Bang dieu khien lop hoc</h2>
          <p className="mt-2 text-sm text-slate-500">Tim thanh vien phu hop va quan ly nhom cua ban.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Tong so sinh vien" value={stats.totalStudents ?? students.length} tone="blue" icon={Users} />
          <StatCard label="Da co nhom" value={stats.studentsInTeam ?? 0} tone="green" icon={UserCheck} />
          <StatCard label="Chua co nhom" value={stats.studentsWithoutTeam ?? 0} tone="orange" icon={UserPlus} />
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_520px]">
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-950">Danh sach sinh vien</h2>
              <span className="text-xs font-medium text-slate-500">{students.length}/{stats.totalStudents ?? students.length}</span>
            </div>
            <Filters filters={filters} setFilters={setFilters} />
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {students.map((student) => <StudentCard key={student.id} student={student} />)}
            </div>
          </section>
          <aside className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-950">Danh sach nhom</h2>
              <span className="text-xs font-medium text-slate-500">{teams.length} nhom</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
              {teams.map((group) => <GroupCard key={group.id} group={group} onJoin={onJoinGroup} />)}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function MyTeamPage({ profile, teams, onFindTeam, onCreateTeam, onJoinGroup }) {
  const myTeam = teams.find((team) => team.members?.some((member) => member.id === profile?.id));

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
      {myTeam ? (
        <section>
          <h2 className="text-2xl font-black text-slate-950">Nhom cua ban</h2>
          <div className="mt-5">
            <GroupCard group={myTeam} onJoin={onJoinGroup} />
          </div>
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-b from-blue-50/70 to-white px-5 py-14 text-center shadow-sm">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-blue-100 text-blue-600"><Users size={42} /></div>
          <h2 className="mt-6 text-2xl font-black tracking-normal text-slate-950">Ban hien chua co nhom</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">Kham pha danh sach nhom phu hop, hoac tu tao nhom moi va tro thanh truong nhom.</p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={onFindTeam} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"><Search size={17} /> Tim nhom ngay</button>
            <button onClick={onCreateTeam} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50"><UserPlus size={17} /> Tao nhom moi</button>
          </div>
        </section>
      )}
    </main>
  );
}

function CreateTeamPage({ profile, onCreated, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    targetGrade: "A+",
    maxMembers: 5,
    skills: "Trach nhiem, Chu dong",
    commitments: defaultCommitments.join(", ")
  });

  async function submit(event) {
    event.preventDefault();
    await api.createTeam({
      name: form.name,
      description: form.description,
      targetGrade: form.targetGrade,
      maxMembers: Number(form.maxMembers),
      skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
      commitments: form.commitments.split(",").map((item) => item.trim()).filter(Boolean),
      leaderId: profile.id
    });
    onCreated();
  }

  return (
    <main className="mx-auto max-w-[960px] px-4 py-6 sm:px-6 lg:px-8">
      <form onSubmit={submit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Tao nhom moi</h2>
          <p className="mt-2 text-sm text-slate-500">Du lieu se duoc gui len API `/api/teams`.</p>
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-black text-slate-950"><BookOpen size={18} className="text-blue-600" /> Thong tin co ban</h3>
          <div className="mt-5 grid gap-4">
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Ten nhom" />
            <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-24 rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Mo ta nhom" />
            <div className="grid gap-4 sm:grid-cols-2">
              <select value={form.targetGrade} onChange={(event) => setForm({ ...form, targetGrade: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none">
                <option>A+</option><option>A</option><option>B+</option>
              </select>
              <input type="number" min="2" max="10" value={form.maxMembers} onChange={(event) => setForm({ ...form, maxMembers: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none" />
            </div>
            <input value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none" placeholder="Ky nang, cach nhau bang dau phay" />
            <textarea value={form.commitments} onChange={(event) => setForm({ ...form, commitments: event.target.value })} className="min-h-20 rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm outline-none" placeholder="Cam ket, cach nhau bang dau phay" />
          </div>
        </section>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50">Huy</button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"><Plus size={17} /> Tao nhom</button>
        </div>
      </form>
    </main>
  );
}

function ProfilePage({ profile, onSaved }) {
  const [form, setForm] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const skillSuggestions = ["Giao tiếp", "Chủ động", "Leadership", "Teamwork", "Thuyết trình", "Giải quyết vấn đề"];

  useEffect(() => {
    setForm(profile ? { ...profile, skills: profile.skills ?? [] } : null);
    setSkillInput("");
  }, [profile]);

  if (!form) return null;

  function addSkill(skill) {
    const value = skill.trim();
    if (!value || form.skills.includes(value)) return;
    setForm({ ...form, skills: [...form.skills, value] });
    setSkillInput("");
  }

  function removeSkill(skill) {
    setForm({ ...form, skills: form.skills.filter((item) => item !== skill) });
  }

  async function save() {
    const updated = await api.updateStudent(form.id, {
      email: form.email,
      major: form.major,
      targetGrade: form.targetGrade,
      commitmentHours: form.commitmentHours,
      skills: form.skills,
      bio: form.bio,
      github: form.github,
      linkedin: form.linkedin,
      website: form.website
    });
    onSaved(updated);
  }

  return (
    <main className="mx-auto max-w-[1160px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-black tracking-normal text-slate-950 sm:text-3xl">Ho so ca nhan</h2>
          <p className="mt-2 text-sm text-slate-500">Cap nhat profile qua API `/api/students/{form.id}`.</p>
        </div>
        <button onClick={save} className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"><Pencil size={17} /> Luu thay doi</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <img src={form.avatar} alt={form.name} className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-slate-100" />
          <h3 className="mt-4 text-lg font-black text-slate-950">{form.name}</h3>
          <p className="text-sm text-slate-500">{form.studentCode}</p>
          <div className="mt-3"><Badge tone="blue">{form.major}</Badge></div>
          <div className="mt-6 flex items-center justify-center gap-1 text-amber-500">
            {[1, 2, 3, 4].map((star) => <Star key={star} size={20} fill="currentColor" />)}
            <Star size={20} className="text-amber-300" fill="currentColor" />
            <span className="ml-2 text-sm font-semibold text-slate-700">{form.rating}</span>
          </div>
        </aside>
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-950">Mục tiêu & Cam kết</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Mục tiêu học tập
                <select value={form.targetGrade} onChange={(event) => setForm({ ...form, targetGrade: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                  <option>A+</option><option>A</option><option>B+</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Thời gian cam kết
                <select value={form.commitmentHours ?? ""} onChange={(event) => setForm({ ...form, commitmentHours: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                  <option value="">Chọn thời gian</option>
                  <option>8h/tuần</option>
                  <option>10h/tuần</option>
                  <option>12h/tuần</option>
                  <option>15h/tuần</option>
                  <option>20h/tuần</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-950">Kỹ năng mềm</h3>
            <p className="mt-1 text-xs text-slate-500">Thêm các kỹ năng giúp bạn nổi bật khi ghép nhóm.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="rounded-full text-blue-500 hover:text-blue-800" aria-label={`Xóa ${skill}`}>
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addSkill(skillInput);
                  }
                }}
                className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Thêm kỹ năng (Vd: Giao tiếp)"
              />
              <button type="button" onClick={() => addSkill(skillInput)} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50">
                <Plus size={17} />
                Thêm
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              Gợi ý:
              {skillSuggestions.map((skill) => (
                <button key={skill} type="button" onClick={() => addSkill(skill)} className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={form.skills.includes(skill)}>
                  + {skill}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-950">Giới thiệu bản thân</h3>
            <p className="mt-1 text-xs text-slate-500">Điểm mạnh, phong cách làm việc, thái độ teamwork.</p>
            <textarea value={form.bio ?? ""} onChange={(event) => setForm({ ...form, bio: event.target.value })} className="mt-4 min-h-28 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Giới thiệu bản thân" />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-950">Liên kết ngoài</h3>
            <div className="mt-4 grid gap-3">
              {[[Github, "github"], [Linkedin, "linkedin"], [Globe, "website"]].map(([Icon, field]) => (
                <label key={field} className="grid grid-cols-[42px_1fr] gap-3">
                  <span className="grid h-10 place-items-center rounded-xl bg-slate-100 text-slate-500"><Icon size={18} /></span>
                  <input value={form[field] ?? ""} onChange={(event) => setForm({ ...form, [field]: event.target.value })} className="h-10 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder={field} />
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [profile, setProfile] = useState(null);
  const [joiningGroup, setJoiningGroup] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ query: "", skill: "Tat ca ky nang", goal: "Tat ca muc tieu", status: "Tat ca" });

  async function loadBase() {
    setError("");
    try {
      const [classroomData, teamData, profileData] = await Promise.all([api.getClassroom(), api.getTeams(), api.getProfile()]);
      setClassroom(classroomData);
      setTeams(teamData);
      setProfile(profileData);
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
          skill: filters.skill === "Tat ca ky nang" ? "" : filters.skill,
          goal: filters.goal === "Tat ca muc tieu" ? "" : filters.goal,
          status: filters.status === "Tat ca" ? "" : filters.status
        });
        setStudents(data);
      } catch (err) {
        setError(err.message);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [filters]);

  const pageTitle = useMemo(() => ({ dashboard: "Dashboard", "my-team": "My Team", profile: "Profile", "create-team": "Create Team" }[activePage]), [activePage]);

  async function submitJoinRequest(teamId, payload) {
    await api.createJoinRequest(teamId, payload);
    setJoiningGroup(null);
    setNotice("Da gui yeu cau gia nhap nhom.");
  }

  async function refreshAfterTeamCreated() {
    await loadBase();
    setActivePage("my-team");
    setNotice("Da tao nhom moi.");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage={activePage} onNavigate={setActivePage} profile={profile} />
        <div className="min-w-0 flex-1">
          <Topbar classroom={classroom} title={pageTitle} onMenu={() => setSidebarOpen(true)} />
          {error ? <div className="mx-auto mt-4 max-w-[1280px] rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
          {notice ? <div className="mx-auto mt-4 max-w-[1280px] rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{notice}</div> : null}
          {activePage === "dashboard" ? <DashboardPage classroom={classroom} students={students} teams={teams} filters={filters} setFilters={setFilters} onJoinGroup={setJoiningGroup} /> : null}
          {activePage === "my-team" ? <MyTeamPage profile={profile} teams={teams} onFindTeam={() => setActivePage("dashboard")} onCreateTeam={() => setActivePage("create-team")} onJoinGroup={setJoiningGroup} /> : null}
          {activePage === "create-team" && profile ? <CreateTeamPage profile={profile} onCancel={() => setActivePage("my-team")} onCreated={refreshAfterTeamCreated} /> : null}
          {activePage === "profile" ? <ProfilePage profile={profile} onSaved={(updated) => { setProfile(updated); setNotice("Da luu ho so."); }} /> : null}
        </div>
      </div>
      {joiningGroup ? <JoinCommitmentModal group={joiningGroup} profile={profile} onSubmit={submitJoinRequest} onClose={() => setJoiningGroup(null)} /> : null}
    </div>
  );
}
