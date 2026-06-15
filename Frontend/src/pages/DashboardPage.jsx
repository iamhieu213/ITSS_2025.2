import { UserCheck, UserPlus, Users } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Filters from "../components/Filters.jsx";
import GroupCard from "../components/GroupCard.jsx";
import StatCard from "../components/StatCard.jsx";
import StudentCard from "../components/StudentCard.jsx";

const studentsPerPage = 8;
const groupsPerPage = 3;

export default function DashboardPage({ classroom, students, teams, filters, setFilters, currentStudentId, isStudentInTeam = false, joinRequests = [], onJoinGroup, onInviteStudent, onViewStudent }) {
  const stats = classroom?.stats ?? {};
  const [page, setPage] = useState(1);
  const [groupPage, setGroupPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(students.length / studentsPerPage));
  const totalGroupPages = Math.max(1, Math.ceil(teams.length / groupsPerPage));
  const visibleStudents = useMemo(() => {
    const start = (page - 1) * studentsPerPage;
    return students.slice(start, start + studentsPerPage);
  }, [page, students]);
  const visibleTeams = useMemo(() => {
    const start = (groupPage - 1) * groupsPerPage;
    return teams.slice(start, start + groupsPerPage);
  }, [groupPage, teams]);
  const startIndex = students.length ? (page - 1) * studentsPerPage + 1 : 0;
  const endIndex = Math.min(page * studentsPerPage, students.length);
  const groupStartIndex = teams.length ? (groupPage - 1) * groupsPerPage + 1 : 0;
  const groupEndIndex = Math.min(groupPage * groupsPerPage, teams.length);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    if (groupPage > totalGroupPages) setGroupPage(totalGroupPages);
  }, [groupPage, totalGroupPages]);

  return (
    <main className="mx-auto max-w-[1580px] px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-[1280px]">
        <div className="mb-6">
          <h2 className="text-2xl font-black tracking-normal text-slate-950 sm:text-3xl">Bảng điều khiển lớp học</h2>
          <p className="mt-2 text-sm text-slate-500">Tìm thành viên phù hợp và quản lý nhóm của bạn.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Tổng số sinh viên" value={stats.totalStudents ?? students.length} tone="blue" icon={Users} />
          <StatCard label="Đã có nhóm" value={stats.studentsInTeam ?? 0} tone="green" icon={UserCheck} />
          <StatCard label="Chưa có nhóm" value={stats.studentsWithoutTeam ?? 0} tone="orange" icon={UserPlus} />
        </div>
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_520px]">
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-950">Danh sách sinh viên</h2>
              <span className="text-xs font-medium text-slate-500">{students.length}/{stats.totalStudents ?? students.length}</span>
            </div>
            <Filters filters={filters} setFilters={setFilters} />
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {visibleStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  currentStudentId={currentStudentId}
                  onInvite={onInviteStudent}
                  onView={onViewStudent}
                />
              ))}
            </div>
            <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row">
              <p className="text-sm font-medium text-slate-500">
                Hiển thị {startIndex}-{endIndex} trong {students.length} sinh viên
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`grid h-9 w-9 place-items-center rounded-xl border text-sm font-bold shadow-sm ${
                      page === pageNumber
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={page === totalPages}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </section>
          <aside className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-950">Danh sách nhóm</h2>
              <span className="text-xs font-medium text-slate-500">{teams.length} nhóm</span>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
              {visibleTeams.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  currentStudentId={currentStudentId}
                  isStudentInTeam={isStudentInTeam}
                  joinRequests={joinRequests}
                  onJoin={onJoinGroup}
                />
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-center text-sm font-medium text-slate-500">
                Hiển thị {groupStartIndex}-{groupEndIndex} trong {teams.length} nhóm
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setGroupPage((current) => Math.max(1, current - 1))}
                  disabled={groupPage === 1}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trước
                </button>
                {Array.from({ length: totalGroupPages }, (_, index) => index + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setGroupPage(pageNumber)}
                    className={`grid h-9 w-9 place-items-center rounded-xl border text-sm font-bold shadow-sm ${
                      groupPage === pageNumber
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setGroupPage((current) => Math.min(totalGroupPages, current + 1))}
                  disabled={groupPage === totalGroupPages}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
