import { BookOpen, Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { api } from "../api.js";
import { defaultCommitments, skillSuggestions } from "../constants/studymates.js";

const targetGrades = ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"];

function validate(form) {
  const errors = {};
  const name = form.name.trim();
  const description = form.description.trim();
  const maxMembers = Number(form.maxMembers);
  const commitments = form.commitments.split(",").map((s) => s.trim()).filter(Boolean);

  if (!name) {
    errors.name = "Tên nhóm không được để trống.";
  } else if (name.length < 3) {
    errors.name = "Tên nhóm phải có ít nhất 3 ký tự.";
  }

  if (!description) {
    errors.description = "Mô tả không được để trống.";
  } else if (description.length < 5) {
    errors.description = "Mô tả phải có ít nhất 5 ký tự.";
  }

  if (isNaN(maxMembers) || !Number.isInteger(maxMembers) || maxMembers < 2 || maxMembers > 10) {
    errors.maxMembers = "Số thành viên tối đa phải từ 2 đến 10.";
  }

  if (commitments.length === 0) {
    errors.commitments = "Vui lòng nhập ít nhất một cam kết.";
  }

  return errors;
}

export default function CreateTeamPage({ profile, onCreated, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    targetGrade: "A+",
    maxMembers: 5,
    skills: "Trách nhiệm, Chủ động",
    commitments: defaultCommitments.join(", ")
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(field, value) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    // Xóa lỗi của field khi user bắt đầu sửa
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  }

  async function submit(event) {
    event.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await api.createTeam({
        name: form.name.trim(),
        description: form.description.trim(),
        targetGrade: form.targetGrade,
        maxMembers: Number(form.maxMembers),
        skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
        commitments: form.commitments.split(",").map((item) => item.trim()).filter(Boolean),
        leaderId: profile.id
      });
      onCreated();
    } catch (err) {
      Swal.fire({
        title: "Tạo nhóm thất bại",
        text: err.message || "Đã xảy ra lỗi, vui lòng thử lại.",
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-[960px] px-4 py-6 sm:px-6 lg:px-8">
      <form onSubmit={submit} noValidate className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-950">Tạo nhóm mới</h2>
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-black text-slate-950">
            <BookOpen size={18} className="text-blue-600" /> Thông tin cơ bản
          </h3>
          <div className="mt-5 grid gap-4">

            {/* Tên nhóm */}
            <div className="grid gap-1">
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`h-11 rounded-xl border px-3 text-sm shadow-sm outline-none focus:ring-4 focus:ring-blue-100 ${errors.name ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
                placeholder="Tên nhóm (ít nhất 3 ký tự)"
              />
              {errors.name && <p className="text-xs font-medium text-red-500 px-1">{errors.name}</p>}
            </div>

            {/* Mô tả */}
            <div className="grid gap-1">
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className={`min-h-24 rounded-xl border px-3 py-3 text-sm shadow-sm outline-none focus:ring-4 focus:ring-blue-100 ${errors.description ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
                placeholder="Mô tả nhóm (ít nhất 5 ký tự)"
              />
              {errors.description && <p className="text-xs font-medium text-red-500 px-1">{errors.description}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Mục tiêu điểm */}
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-500 px-1">Mục tiêu điểm</label>
                <select
                  value={form.targetGrade}
                  onChange={(e) => handleChange("targetGrade", e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none"
                >
                  {targetGrades.map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              {/* Số thành viên tối đa */}
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-500 px-1">Số thành viên tối đa (2–10)</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={form.maxMembers}
                  onChange={(e) => handleChange("maxMembers", e.target.value)}
                  className={`h-11 rounded-xl border px-3 text-sm shadow-sm outline-none focus:ring-4 focus:ring-blue-100 ${errors.maxMembers ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
                />
                {errors.maxMembers && <p className="text-xs font-medium text-red-500 px-1">{errors.maxMembers}</p>}
              </div>
            </div>

            {/* Kỹ năng */}
            <div className="space-y-2">
              <input
                value={form.skills}
                onChange={(e) => handleChange("skills", e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Kỹ năng, cách nhau bằng dấu phẩy"
              />
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
                        const nextSkills = isSelected
                          ? currentSkills.filter(s => s.toLowerCase() !== skill.toLowerCase())
                          : [...currentSkills, skill];
                        handleChange("skills", nextSkills.join(", "));
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

            {/* Cam kết */}
            <div className="grid gap-1">
              <textarea
                value={form.commitments}
                onChange={(e) => handleChange("commitments", e.target.value)}
                className={`min-h-20 rounded-xl border px-3 py-3 text-sm shadow-sm outline-none focus:ring-4 focus:ring-blue-100 ${errors.commitments ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-blue-400"}`}
                placeholder="Cam kết, cách nhau bằng dấu phẩy"
              />
              {errors.commitments && <p className="text-xs font-medium text-red-500 px-1">{errors.commitments}</p>}
            </div>

          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCancel} disabled={loading} className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-50">Hủy</button>
          <button disabled={loading} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}
            {loading ? "Đang tạo..." : "Tạo nhóm"}
          </button>
        </div>
      </form>
    </main>
  );
}
