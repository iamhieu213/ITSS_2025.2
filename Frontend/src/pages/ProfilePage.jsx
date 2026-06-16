import { Github, Globe, Linkedin, MessageSquare, Pencil, Plus, Star, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import Badge from "../components/Badge.jsx";
import { goals, skillSuggestions } from "../constants/studymates.js";

export default function ProfilePage({ profile, onSaved }) {
  const [form, setForm] = useState(null);
  const [skillInput, setSkillInput] = useState("");

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
          <h2 className="text-2xl font-black tracking-normal text-slate-950 sm:text-3xl">Hồ sơ cá nhân</h2>
        </div>
        <button onClick={save} className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"><Pencil size={17} /> Lưu thay đổi</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <img src={form.avatar} alt={form.name} className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-slate-100" />
            <h3 className="mt-4 text-lg font-black text-slate-950">{form.name}</h3>
            <p className="text-sm text-slate-500">{form.studentCode}</p>
            <div className="mt-3"><Badge tone="blue">{form.major}</Badge></div>
            <div className="mt-6 flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  fill="currentColor"
                  className={star <= Math.round(form.rating ?? 0) ? "text-amber-500" : "text-slate-200"}
                />
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-700">{form.rating != null ? Number(form.rating).toFixed(1) : "--"}</span>
            </div>
          </div>

          {(form.reviews ?? []).length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-500" />
                <h3 className="text-sm font-black text-slate-950">Đánh giá từ người khác</h3>
                <span className="ml-auto rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-600">{(form.reviews ?? []).length}</span>
              </div>
              <div className="space-y-3">
                {(form.reviews ?? []).map((review, idx) => (
                  <div key={review.id ?? idx} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={review.reviewer?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewerId}`}
                        alt={review.reviewer?.name ?? "Ẩn danh"}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-800">{review.reviewer?.name ?? "Ẩn danh"}</p>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={11}
                              fill="currentColor"
                              className={star <= review.rating ? "text-amber-500" : "text-slate-200"}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {review.content && (
                      <p className="mt-2 text-xs leading-5 text-slate-600">{review.content}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-950">Mục tiêu & Cam kết</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-slate-900">
                Mục tiêu học tập
                <select value={form.targetGrade} onChange={(event) => setForm({ ...form, targetGrade: event.target.value })} className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
                  {goals.filter((g) => g.value !== "ALL_GOALS").map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
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
