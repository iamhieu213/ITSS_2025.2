import { Clock3, Search, ShieldCheck, UserPlus, Users } from "lucide-react";
import React from "react";
import GroupCard from "../components/GroupCard.jsx";

function requestStatusLabel(status) {
  const labels = {
    PENDING: "Đang chờ duyệt",
    APPROVED: "Đã được duyệt",
    REJECTED: "Đã từ chối"
  };

  return labels[status] ?? status;
}

function RequestedTeamCard({ request }) {
  const team = request.team;
  if (!team) return null;

  return (
    <article className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{team.name}</h3>
          <p className="mt-1 text-xs text-slate-500">Trưởng nhóm: {team.leader?.name ?? "Chưa có"}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
          <ShieldCheck size={13} />
          {requestStatusLabel(request.status)}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{team.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <span className="flex items-center gap-1"><Users size={14} /> {team.capacity}</span>
        <span className="flex items-center gap-1"><Clock3 size={14} /> {new Date(request.createdAt).toLocaleDateString("vi-VN")}</span>
      </div>
      {request.message ? <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">"{request.message}"</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {(team.skills ?? []).map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{skill}</span>)}
      </div>
    </article>
  );
}

export default function MyTeamPage({ profile, teams, joinRequests = [], onFindTeam, onCreateTeam, onJoinGroup }) {
  const myTeam = profile?.status === "IN_TEAM"
    ? teams.find((team) => team.members?.some((member) => member.id === profile?.id))
    : null;
  const requestedTeamIds = new Set(joinRequests.map((request) => request.teamId));
  const suggestedTeams = teams.slice(0, 3);

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-7 sm:px-6 lg:px-8">
      {myTeam ? (
        <section>
          <h2 className="text-2xl font-black text-slate-950">Nhóm của bạn</h2>
          <div className="mt-5">
            <GroupCard group={myTeam} onJoin={onJoinGroup} />
          </div>
        </section>
      ) : (
        <>
          <section className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-b from-blue-50/70 to-white px-5 py-14 text-center shadow-sm sm:py-16">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-blue-100 text-blue-600">
              <Users size={42} />
            </div>
            <h2 className="mt-6 text-2xl font-black tracking-normal text-slate-950">Bạn hiện chưa có nhóm</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Khám phá danh sách nhóm phù hợp với kỹ năng và mục tiêu của bạn,
              <br className="hidden sm:block" />
              hoặc tự tạo nhóm mới và trở thành trưởng nhóm.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={onFindTeam} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700">
                <Search size={17} />
                Tìm nhóm ngay
              </button>
              <button onClick={onCreateTeam} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50">
                <UserPlus size={17} />
                Tạo nhóm mới
              </button>
            </div>
          </section>

          {joinRequests.length ? (
            <section className="mt-10">
              <h2 className="text-2xl font-black tracking-normal text-slate-950">Nhóm bạn đã xin gia nhập</h2>
              <p className="mt-2 text-sm text-slate-500">Theo dõi các yêu cầu đang chờ trưởng nhóm xử lý.</p>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {joinRequests.map((request) => (
                  <RequestedTeamCard key={request.id} request={request} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="mt-10">
            <h2 className="text-2xl font-black tracking-normal text-slate-950">Nhóm gợi ý cho bạn</h2>
            <p className="mt-2 text-sm text-slate-500">Dựa trên kỹ năng mềm, mục tiêu và mức độ cam kết của bạn.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {suggestedTeams.filter((group) => !requestedTeamIds.has(group.id)).map((group) => (
                <GroupCard key={group.id} group={group} onJoin={onJoinGroup} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
