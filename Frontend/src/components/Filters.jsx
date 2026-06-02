import { Filter, Search } from "lucide-react";
import React from "react";
import { goals, skillOptions, statuses } from "../constants/studymates.js";

export default function Filters({ filters, setFilters }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
        <Filter size={16} />
        Bộ lọc
      </div>
      <div className="grid gap-3">
        <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
          <Search size={17} className="text-slate-400" />
          <input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} className="w-full text-sm outline-none" placeholder="Tên hoặc MSSV..." />
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          <select value={filters.skill} onChange={(event) => setFilters({ ...filters, skill: event.target.value })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none">
            {skillOptions.map((skill) => <option key={skill.value} value={skill.value}>{skill.label}</option>)}
          </select>
          <select value={filters.goal} onChange={(event) => setFilters({ ...filters, goal: event.target.value })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none">
            {goals.map((goal) => <option key={goal.value} value={goal.value}>{goal.label}</option>)}
          </select>
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none">
            {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
        </div>
      </div>
    </section>
  );
}
