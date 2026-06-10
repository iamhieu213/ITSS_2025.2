import { Crown, Target, Users } from "lucide-react";
import React from "react";
import Badge from "./Badge.jsx";

export default function GroupCard({ group, currentStudentId, onJoin, joinRequests = [], isStudentInTeam = false }) {
  const isMember = (group.members ?? []).some((member) => member.id === currentStudentId);
  const isLeader = group.leaderId === currentStudentId;

  const userRequest = (joinRequests ?? []).find(
    (r) => r.teamId === group.id && r.studentId === currentStudentId
  );
  const isPending = userRequest?.status === "PENDING";
  const isRejected = userRequest?.status === "REJECTED";

  const canJoin = !isMember && !isLeader && !isPending && !isRejected && !isStudentInTeam;

  let buttonText = "Xin gia nhập";
  let buttonStyle = "bg-blue-600 text-white hover:bg-blue-700 transition duration-150 active:scale-[0.98]";

  if (isMember || isLeader) {
    buttonText = "Nhóm của bạn";
    buttonStyle = "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400";
  } else if (isPending) {
    buttonText = "Đang chờ duyệt";
    buttonStyle = "cursor-not-allowed border border-amber-200 bg-amber-50 text-amber-700 font-semibold";
  } else if (isRejected) {
    buttonText = "Yêu cầu bị từ chối";
    buttonStyle = "cursor-not-allowed border border-red-200 bg-red-50 text-red-700 font-semibold";
  } else if (isStudentInTeam) {
    buttonText = "Xin gia nhập";
    buttonStyle = "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400";
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{group.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <Crown size={14} className="text-amber-500" />
            {group.leader?.name ?? "Chưa có trưởng nhóm"}
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
        Mục tiêu: <strong className="text-slate-950">{group.targetGrade}</strong>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(group.skills ?? []).map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{skill}</span>)}
      </div>
      <button
        type="button"
        onClick={() => onJoin?.(group)}
        disabled={!canJoin}
        className={`mt-4 h-11 w-full rounded-xl text-sm font-bold shadow-sm ${buttonStyle}`}
      >
        {buttonText}
      </button>
    </article>
  );
}
