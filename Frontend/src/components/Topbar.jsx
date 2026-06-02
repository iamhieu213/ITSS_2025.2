import { Bell, Menu } from "lucide-react";
import React from "react";
import Badge from "./Badge.jsx";

export default function Topbar({ classroom, onMenu }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden" onClick={onMenu}>
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-base font-bold text-slate-950 sm:text-lg">{classroom?.name ?? "StudyMates"}</h1>
              <span className="hidden text-slate-400 sm:inline">- {classroom?.code ?? "SSH1151"}</span>
              <Badge tone="gray">{classroom?.semester ?? "Học kỳ"}</Badge>
            </div>
            <p className="mt-1 hidden text-xs text-slate-500 sm:block">Giảng viên: {classroom?.lecturer ?? "Đang tải"}</p>
          </div>
        </div>
        <button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm">
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
