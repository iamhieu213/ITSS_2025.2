import { LogOut, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

const statuses = ["new", "contacted", "won", "closed"];

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  async function load() {
    const [statsData, bookingData, serviceData] = await Promise.all([
      api.getStats(),
      api.getBookings(),
      api.getServices()
    ]);
    setStats(statsData);
    setBookings(bookingData);
    setServices(serviceData);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    await api.updateBookingStatus(id, status);
    await load();
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <main className="min-h-screen bg-[#f7faf7]">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-cedar">Admin</p>
            <h1 className="text-2xl font-black text-ink">Operations dashboard</h1>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={load}><RefreshCw size={16} /> Refresh</button>
            <button className="btn-primary" onClick={logout}><LogOut size={16} /> Logout</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Services", stats?.services ?? 0],
            ["Bookings", stats?.bookings ?? 0],
            ["Messages", stats?.contacts ?? 0]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-ink/10 bg-white p-5">
              <p className="text-sm font-bold text-ink/55">{label}</p>
              <p className="mt-2 text-3xl font-black text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-lg border border-ink/10 bg-white p-5">
            <h2 className="text-xl font-black text-ink">Bookings</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-ink/10 text-ink/55">
                  <tr>
                    <th className="py-3">Client</th>
                    <th>Service</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-ink/10 align-top">
                      <td className="py-4">
                        <div className="font-bold text-ink">{booking.name}</div>
                        <div className="text-ink/55">{booking.email}</div>
                      </td>
                      <td>{booking.service?.title}</td>
                      <td>{booking.phone}</td>
                      <td>
                        <select className="field py-2" value={booking.status} onChange={(e) => updateStatus(booking.id, e.target.value)}>
                          {statuses.map((status) => <option key={status}>{status}</option>)}
                        </select>
                      </td>
                      <td className="max-w-xs text-ink/65">{booking.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-ink/10 bg-white p-5">
            <h2 className="text-xl font-black text-ink">Services</h2>
            <div className="mt-5 grid gap-3">
              {services.map((service) => (
                <div key={service.id} className="rounded-md border border-ink/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-ink">{service.title}</h3>
                    <span className="h-3 w-8 rounded-full" style={{ backgroundColor: service.accent }} />
                  </div>
                  <p className="mt-2 text-sm text-ink/60">{service.duration} · from ${service.priceFrom}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
