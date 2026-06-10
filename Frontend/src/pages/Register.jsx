import { GraduationCap, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { api } from "../api.js";

const MAJORS = [
  "Kỹ thuật phần mềm",
  "Khoa học máy tính",
  "Hệ thống thông tin",
  "Trí tuệ nhân tạo",
  "An toàn thông tin",
  "Công nghệ thông tin (Global ICT)"
];

export default function Register({ onRegisterSuccess, onNavigateToLogin }) {
  const [form, setForm] = useState({
    studentCode: "",
    name: "",
    email: "",
    password: "",
    major: MAJORS[0]
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const session = await api.register({
        studentCode: form.studentCode.trim(),
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        major: form.major
      });
      setSuccess("Đăng ký thành công! Đang tự động đăng nhập...");
      localStorage.setItem("token", session.token);
      
      // Auto login after 1.5s to let the user see the success message
      setTimeout(() => {
        onRegisterSuccess(session.student);
      }, 1500);
    } catch (err) {
      setError(err.message ?? "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.");
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <GraduationCap size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900">Tạo tài khoản mới</h2>
          <p className="mt-2 text-sm text-slate-500">
            Đăng ký làm thành viên StudyMates để tuyển nhóm học tập
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {success ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-semibold text-emerald-700 animate-pulse">
              {success}
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="studentCode" className="block text-sm font-bold text-slate-700">
                  Mã số sinh viên (MSSV)
                </label>
                <div className="mt-1">
                  <input
                    id="studentCode"
                    type="text"
                    required
                    placeholder="Ví dụ: 20215000"
                    value={form.studentCode}
                    onChange={(e) => setForm({ ...form, studentCode: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700">
                  Họ và tên
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                  Email sinh viên
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="email@hust.edu.vn"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="major" className="block text-sm font-bold text-slate-700">
                  Chuyên ngành
                </label>
                <div className="mt-1">
                  <select
                    id="major"
                    value={form.major}
                    onChange={(e) => setForm({ ...form, major: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition"
                  >
                    {MAJORS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                  Mật khẩu
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                  {error}
                </div>
              ) : null}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                >
                  <UserPlus size={16} />
                  {loading ? "Đang xử lý đăng ký..." : "Đăng ký thành viên"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center text-sm">
          <span className="text-slate-500">Đã có tài khoản? </span>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="font-bold text-blue-600 hover:text-blue-700 transition"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </main>
  );
}
