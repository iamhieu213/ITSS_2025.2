import { BookOpen, Plus } from "lucide-react";
import React, { useState } from "react";
import { api } from "../api.js";
import { defaultCommitments, skillSuggestions } from "../constants/studymates.js";

const targetGrades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"];

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
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-black text-slate-950">
            <BookOpen size={18} className="text-blue-600" /> Thông tin cơ bản
          </h3>
          <div className="mt-5 grid gap-4">
            <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Tên nhóm" />
            <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-24 rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Mô tả nhóm" />
            
            <div className="grid gap-4 sm:grid-cols-2">
              <select value={form.targetGrade} onChange={(event) => setForm({ ...form, targetGrade: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none">
                {targetGrades.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <input type="number" min="2" max="10" value={form.maxMembers} onChange={(event) => setForm({ ...form, maxMembers: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none" />
            </div>

            <div className="space-y-2">
              <input value={form.skills} onChange={(event) => setForm({ ...form, skills: event.target.value })} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Kỹ năng, cách nhau bằng dấu phẩy" />
              
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-semibold text-slate-500 mr-1">Gợi ý:</span>
                {skillSuggestions.map((skill) => {
                  const currentSkills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
                  const isSelected = currentSkills.some(s => s.toLowerCase() === skill.toLowerCase());
                  
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        let nextSkills;
                        if (isSelected) {
                          nextSkills = currentSkills.filter(s => s.toLowerCase() !== skill.toLowerCase());
                        } else {
                          nextSkills = [...currentSkills, skill];
                        }
                        setForm({ ...form, skills: nextSkills.join(", ") });
                      }}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border transition duration-150 active:scale-95 ${
                        isSelected
                          ? "bg-blue-50 border-blue-200 text-blue-700 font-bold"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {isSelected ? "✓" : "+"} {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea value={form.commitments} onChange={(event) => setForm({ ...form, commitments: event.target.value })} className="min-h-20 rounded-xl border border-slate-200 px-3 py-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="Cam kết, cách nhau bằng dấu phẩy" />
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
