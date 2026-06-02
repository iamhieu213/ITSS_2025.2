import { CheckCircle2, Layers3, Mail, Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import ServiceCard from "../components/ServiceCard.jsx";
import { api } from "../api.js";

const initialBooking = { name: "", email: "", phone: "", company: "", message: "", serviceId: "" };
const initialContact = { name: "", email: "", subject: "", message: "" };

export default function Home() {
  const [services, setServices] = useState([]);
  const [booking, setBooking] = useState(initialBooking);
  const [contact, setContact] = useState(initialContact);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api.getServices().then((items) => {
      setServices(items);
      setBooking((current) => ({ ...current, serviceId: items[0]?.id ?? "" }));
    });
  }, []);

  async function submitBooking(event) {
    event.preventDefault();
    await api.createBooking({ ...booking, serviceId: Number(booking.serviceId) });
    setBooking({ ...initialBooking, serviceId: services[0]?.id ?? "" });
    setNotice("Booking request sent. The team will contact you soon.");
  }

  async function submitContact(event) {
    event.preventDefault();
    await api.createContact(contact);
    setContact(initialContact);
    setNotice("Message received. We will reply by email.");
  }

  return (
    <div className="min-h-screen bg-[#f7faf7]">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-mist">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <p className="mb-4 inline-flex w-fit items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-bold text-moss">
                <Sparkles size={16} /> Fullstack product studio
              </p>
              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
                ITSS Studio
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
                Build polished web products with React interfaces, practical backend systems, and dashboards that teams can operate every day.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#booking" className="btn-primary">Book a consultation</a>
                <a href="#services" className="btn-secondary">Explore services</a>
              </div>
            </div>
            <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-ink shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
                alt="Product team working on a web application"
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-x-6 bottom-6 grid gap-3 rounded-lg bg-white/92 p-4 backdrop-blur sm:grid-cols-3">
                {[
                  ["32", "launches"],
                  ["6 wk", "avg MVP"],
                  ["98%", "handover"]
                ].map(([value, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-ink">{value}</div>
                    <div className="text-xs font-bold uppercase text-ink/55">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-cedar">Services</p>
              <h2 className="mt-2 text-3xl font-black text-ink">From idea to operating product</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-ink/65">
              Each service includes product thinking, implementation, documentation, and a clear admin workflow.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {services.map((service) => <ServiceCard key={service.id} service={service} />)}
          </div>
        </section>

        <section id="process" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-bold uppercase text-cedar">Process</p>
                <h2 className="mt-2 text-3xl font-black text-ink">Clear enough for founders, rigorous enough for engineers</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  [Layers3, "Scope the workflow", "Map the core user journeys, data model, and operational edge cases."],
                  [Rocket, "Ship in increments", "Deliver visible product slices quickly while keeping the architecture maintainable."],
                  [ShieldCheck, "Secure the basics", "Authentication, validation, protected admin routes, and structured API boundaries."],
                  [CheckCircle2, "Handover cleanly", "Seed data, setup notes, and a running local environment for iteration."]
                ].map(([Icon, title, text]) => (
                  <div key={title} className="rounded-lg border border-ink/10 bg-[#f7faf7] p-5">
                    <Icon className="text-moss" size={24} />
                    <h3 className="mt-4 font-bold text-ink">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-ink/65">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="booking" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <form onSubmit={submitBooking} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-ink">Book a project call</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input className="field" placeholder="Name" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} required />
              <input className="field" type="email" placeholder="Email" value={booking.email} onChange={(e) => setBooking({ ...booking, email: e.target.value })} required />
              <input className="field" placeholder="Phone" value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} required />
              <input className="field" placeholder="Company" value={booking.company} onChange={(e) => setBooking({ ...booking, company: e.target.value })} />
              <select className="field sm:col-span-2" value={booking.serviceId} onChange={(e) => setBooking({ ...booking, serviceId: e.target.value })} required>
                {services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
              </select>
              <textarea className="field min-h-32 sm:col-span-2" placeholder="What do you want to build?" value={booking.message} onChange={(e) => setBooking({ ...booking, message: e.target.value })} required />
            </div>
            <button className="btn-primary mt-5" type="submit">Send booking</button>
          </form>

          <form onSubmit={submitContact} className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-2xl font-black text-ink"><Mail size={24} /> Contact</h2>
            <div className="mt-6 grid gap-4">
              <input className="field" placeholder="Name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
              <input className="field" type="email" placeholder="Email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
              <input className="field" placeholder="Subject" value={contact.subject} onChange={(e) => setContact({ ...contact, subject: e.target.value })} required />
              <textarea className="field min-h-32" placeholder="Message" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} required />
            </div>
            <button className="btn-secondary mt-5" type="submit">Send message</button>
            {notice ? <p className="mt-4 rounded-md bg-mist px-3 py-2 text-sm font-semibold text-moss">{notice}</p> : null}
          </form>
        </section>
      </main>
    </div>
  );
}
