import { Clock3, Send, Star, Target } from "lucide-react";
import React from "react";
import { statusLabel } from "../utils/status.js";
import Badge from "./Badge.jsx";

export default function StudentCard({ student, currentStudentId, isCurrentUserLeader = false, onInvite, onView }) {
  const isSelf = student.id === currentStudentId;
  const isLooking = student.status === "LOOKING";
  // Chỉ trưởng nhóm mới có thể mời; bản thân không thể tự mời
  const canInvite = isCurrentUserLeader && isLooking && !isSelf;
  const rating = Number(student.rating ?? 5);
  const ratingText = Number.isInteger(rating) ? rating.toFixed(0) : rating.toFixed(1);

  function getButtonLabel() {
    if (isSelf) return "Chính bạn";
    if (!isLooking) return "Đã có nhóm";
    if (!isCurrentUserLeader) return "Chỉ trưởng nhóm mới có thể mời";
    return "Mời vào nhóm";
  }

  return (
    <article
      className="flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500"
      role="button"
      tabIndex={0}
      onClick={() => onView?.(student)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onView?.(student);
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img src={student.avatar} alt={student.name} className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-slate-100" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-950">{student.name}</h3>
            <p className="text-xs text-slate-500">{student.studentCode}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
              <span className="flex items-center gap-1 text-amber-600"><Star size={14} fill="currentColor" /> {ratingText}</span>
              <span className="flex items-center gap-1"><Target size={14} /> {student.targetGrade}</span>
              <span className="flex items-center gap-1"><Clock3 size={14} /> {student.commitmentHours}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <Badge tone={student.status === "IN_TEAM" ? "green" : "blue"}>{statusLabel(student.status)}</Badge>
        </div>
      </div>
      <div className="mt-4 flex min-h-14 flex-wrap content-start gap-2">
        {(student.skills ?? []).map((skill) => <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{skill}</span>)}
      </div>
      <p className="mt-4 min-h-12 line-clamp-2 text-sm leading-6 text-slate-600">{student.bio}</p>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          if (canInvite) onInvite?.(student);
        }}
        disabled={!canInvite}
        title={!canInvite ? getButtonLabel() : undefined}
        className={`mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold shadow-sm ${
          canInvite
            ? "bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700"
            : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
        }`}
      >
        <Send size={16} />
        {getButtonLabel()}
      </button>
    </article>
  );
}
