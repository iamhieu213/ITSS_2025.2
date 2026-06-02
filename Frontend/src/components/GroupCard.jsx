import { Crown, Target, Users } from "lucide-react";
import React from "react";
import Badge from "./Badge.jsx";

export default function GroupCard({ group, onJoin }) {
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
      <button onClick={() => onJoin(group)} className="mt-4 h-11 w-full rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm hover:bg-blue-700">
        Xin gia nhập
      </button>
    </article>
  );
}
