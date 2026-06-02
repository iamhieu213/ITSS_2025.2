import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "admin@itss.local", password: "admin123" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const session = await api.login(form);
      localStorage.setItem("token", session.token);
      localStorage.setItem("user", JSON.stringify(session.user));
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
        <Link to="/" className="text-sm font-bold text-moss">Back to website</Link>
        <h1 className="mt-5 text-3xl font-black text-ink">Admin login</h1>
        <p className="mt-2 text-sm text-ink/60">Use the seeded admin account to manage bookings.</p>
        <div className="mt-6 grid gap-4">
          <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="field" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error ? <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
        <button className="btn-primary mt-5 w-full" type="submit"><LogIn size={16} /> Login</button>
      </form>
    </main>
  );
}
