import { GraduationCap, LogIn } from "lucide-react";
import React, { useState } from "react";
import { api } from "../api.js";

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await api.login(form);
      localStorage.setItem("token", session.token);
      onLoginSuccess(session.student);
    } catch (err) {
      setError(err.message ?? "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  }

  // Helper to quickly fill in test account
  function fillDemoAccount() {
    setForm({
      email: "tranthuha@hust.edu.vn",
      password: "student123"
    });
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <GraduationCap size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900">StudyMates</h2>
          <p className="mt-2 text-sm text-slate-500">
            Tìm nhóm học tập và đồng đội làm bài tập lớn
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-slate-700">
                Email sinh viên
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@hust.edu.vn"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition duration-150"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                Mật khẩu
              </label>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition duration-150"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                {error}
              </div>
            ) : null}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                <LogIn size={16} />
                {loading ? "Đang xác thực..." : "Đăng nhập"}
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-col gap-3">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400">hoặc trải nghiệm nhanh</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={fillDemoAccount}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-100 transition"
            >
              Sử dụng tài khoản demo (Trần Thu Hà)
            </button>
          </div>
        </div>

        <div className="text-center text-sm">
          <span className="text-slate-500">Chưa có tài khoản? </span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="font-bold text-blue-600 hover:text-blue-700 transition"
          >
            Đăng ký thành viên mới
          </button>
        </div>
      </div>
    </main>
  );
}
