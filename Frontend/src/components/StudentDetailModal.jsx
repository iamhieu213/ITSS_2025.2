import { Clock3, Github, Globe, Linkedin, Mail, Star, Target, X } from "lucide-react";
import React from "react";
import { statusLabel } from "../utils/status.js";
import Badge from "./Badge.jsx";

function formatRating(value) {
  const rating = Number(value ?? 5);
  return Number.isInteger(rating) ? rating.toFixed(0) : rating.toFixed(1);
}

export default function StudentDetailModal({ student, onClose }) {
  if (!student) return null;

  const reviews = student.reviews ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <section
        className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div className="flex min-w-0 items-center gap-4">
            <img src={student.avatar} alt={student.name} className="h-16 w-16 shrink-0 rounded-2xl object-cover ring-4 ring-blue-50" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-xl font-black text-slate-950">{student.name}</h2>
                <Badge tone={student.status === "IN_TEAM" ? "green" : "blue"}>{statusLabel(student.status)}</Badge>
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-500">{student.studentCode} • {student.major}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 text-amber-600">
                  <Star size={14} fill="currentColor" />
                  {formatRating(student.rating)} ({student.ratingCount ?? reviews.length} đánh giá)
                </span>
                <span className="inline-flex items-center gap-1"><Target size={14} /> {student.targetGrade}</span>
                <span className="inline-flex items-center gap-1"><Clock3 size={14} /> {student.commitmentHours}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-105px)] overflow-y-auto p-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="space-y-5">
              <section>
                <h3 className="text-sm font-bold text-slate-950">Giới thiệu</h3>
                <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{student.bio || "Chưa có giới thiệu."}</p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-950">Đánh giá từ thành viên khác</h3>
                <div className="mt-3 space-y-3">
                  {reviews.length ? reviews.map((review) => (
                    <article key={`${review.reviewerId ?? "review"}-${review.id ?? review.createdAt}`} className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{review.reviewerName ?? "Người dùng ẩn danh"}</p>
                          <p className="text-xs text-slate-500">{review.teamName ?? "Nhóm học tập"}</p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                          <Star size={13} fill="currentColor" />
                          {formatRating(review.rating)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{review.content || "Không có nhận xét thêm."}</p>
                    </article>
                  )) : (
                    <p className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                      Chưa có đánh giá nào. Điểm hiển thị mặc định là 5 sao.
                    </p>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-bold text-slate-950">Kỹ năng</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(student.skills ?? []).length ? student.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">{skill}</span>
                  )) : <span className="text-sm text-slate-500">Chưa cập nhật.</span>}
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 p-4">
                <h3 className="text-sm font-bold text-slate-950">Liên hệ</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <a href={`mailto:${student.email}`} className="flex items-center gap-2 hover:text-blue-600"><Mail size={15} /> {student.email}</a>
                  {student.github ? <a href={`https://${student.github.replace(/^https?:\/\//, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-600"><Github size={15} /> GitHub</a> : null}
                  {student.linkedin ? <a href={`https://${student.linkedin.replace(/^https?:\/\//, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-600"><Linkedin size={15} /> LinkedIn</a> : null}
                  {student.website ? <a href={`https://${student.website.replace(/^https?:\/\//, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-600"><Globe size={15} /> Website</a> : null}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
