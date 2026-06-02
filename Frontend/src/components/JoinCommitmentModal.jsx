import { ShieldCheck, X } from "lucide-react";
import React, { useState } from "react";
import { defaultCommitments } from "../constants/studymates.js";

export default function JoinCommitmentModal({ group, profile, onSubmit, onClose }) {
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
        <h2 className="mt-3 text-lg font-black text-slate-950">Cam kết trách nhiệm</h2>
        <p className="mt-1 text-sm text-slate-600"><strong className="text-slate-950">{group.name}</strong> - Trưởng nhóm: {group.leader?.name}</p>
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
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="mt-4 min-h-20 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Lời nhắn cho trưởng nhóm..." />
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50">Hủy</button>
          <button
            onClick={() => onSubmit(group.id, { studentId: profile.id, confirmedCommitments: checked, message })}
            disabled={!profile || checked.length < commitments.length}
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            Xác nhận
          </button>
        </div>
      </section>
    </div>
  );
}
