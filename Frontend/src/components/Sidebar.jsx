import { GraduationCap, Grid2X2, User, UserPlus, Users, X } from "lucide-react";
import React from "react";
import { statusLabel } from "../utils/status.js";
import Badge from "./Badge.jsx";

export default function Sidebar({ open, onClose, activePage, onNavigate, profile }) {
  const navItems = [
    { label: "Bảng điều khiển", page: "dashboard", icon: Grid2X2 },
    { label: "Nhóm của tôi", page: "my-team", icon: Users },
    { label: "Hồ sơ", page: "profile", icon: User }
  ];

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-slate-950/30 lg:hidden ${open ? "block" : "hidden"}`} onClick={onClose} />
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col border-r border-slate-200 bg-white transition lg:static lg:translate-x-0 ${open ? "translate-x-0" : ""}`}>
        <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white">
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="text-[15px] font-bold text-slate-950">StudyMates</div>
              <div className="text-xs text-slate-500">Tìm nhóm học tập</div>
            </div>
          </div>
          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {profile ? (
          <div className="border-b border-slate-200 px-4 py-5">
            <div className="flex items-center gap-3">
              <img src={profile.avatar} alt={profile.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-200" />
              <div>
                <div className="font-bold text-slate-950">{profile.name}</div>
                <div className="text-xs text-slate-500">{profile.studentCode}</div>
              </div>
            </div>
            <div className="mt-4">
              <Badge tone={profile.status === "IN_TEAM" ? "green" : "blue"}>{statusLabel(profile.status)}</Badge>
            </div>
          </div>
        ) : null}

        <nav className="flex-1 space-y-2 px-4 py-4">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                onClose();
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${activePage === item.page ? "bg-blue-100 text-blue-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button onClick={() => onNavigate("create-team")} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
            <UserPlus size={18} />
            Tạo nhóm
          </button>
        </div>
      </aside>
    </>
  );
}
