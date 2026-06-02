import { BookOpen, Plus } from "lucide-react";
import React, { useState } from "react";
import { api } from "../api.js";
import { defaultCommitments } from "../constants/studymates.js";

export default function CreateTeamPage({ profile, onCreated, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    targetGrade: "A+",
    maxMembers: 5,
    skills: "Trách nhiệm, Chủ động",
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
          <h2 className="text-2xl font-black text-slate-950">Tạo nhóm mới</h2>
          <p className="mt-2 text-sm text-slate-500">Dữ liệu sẽ được gửi lên API `/api/teams`.</p>
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-black text-slate-950"><BookOpen size={18} className="text-blue-600" /> Thong tin co ban</h3>
          <div className="mt-5 grid gap-4">
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Tên nhóm" />
            <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-24 rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Mô tả nhóm" />
            <div className="grid gap-4 sm:grid-cols-2">
              <select value={form.targetGrade} onChange={(event) => setForm({ ...form, targetGrade: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none">
                <option>A+</option><option>A</option><option>B+</option>
              </select>
              <input type="number" min="2" max="10" value={form.maxMembers} onChange={(event) => setForm({ ...form, maxMembers: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none" />
            </div>
            <input value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none" placeholder="Kỹ năng, cách nhau bằng dấu phẩy" />
            <textarea value={form.commitments} onChange={(event) => setForm({ ...form, commitments: event.target.value })} className="min-h-20 rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm outline-none" placeholder="Cam kết, cách nhau bằng dấu phẩy" />
          </div>
        </section>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50">Hủy</button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"><Plus size={17} /> Tạo nhóm</button>
        </div>
      </form>
    </main>
  );
}
