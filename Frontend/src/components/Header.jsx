import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm font-black text-white">IS</span>
          <span className="text-base font-bold tracking-normal text-ink">ITSS Studio</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/70 md:flex">
          <a href="#services" className="hover:text-ink">Services</a>
          <a href="#process" className="hover:text-ink">Process</a>
          <a href="#booking" className="hover:text-ink">Booking</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-secondary hidden sm:inline-flex">
            <LayoutDashboard size={16} /> Admin
          </Link>
          <a href="#booking" className="btn-primary">
            Start <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </header>
  );
}
