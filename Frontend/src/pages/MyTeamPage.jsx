import { Check, Clock3, Mail, Search, ShieldCheck, Target, UserPlus, Users, X, Crown, ClipboardList, Sparkles, Star, LogOut, Trash2, MessageSquarePlus } from "lucide-react";
import React from "react";
import Badge from "../components/Badge.jsx";
import GroupCard from "../components/GroupCard.jsx";
import { statusLabel } from "../utils/status.js";

function requestStatusLabel(status) {
  const labels = {
    PENDING: "Đang chờ duyệt",
    APPROVED: "Đã được duyệt",
    REJECTED: "Đã từ chối"
  };

  return labels[status] ?? status;
}

function RequestedTeamCard({ request, reviewerMode = false, onUpdateStatus, onCancelJoinRequest, onViewStudent }) {
  const team = request.team;
  if (!team) return null;

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md ${
        reviewerMode
          ? 'border-indigo-100 hover:border-indigo-200 cursor-pointer'
          : 'border-blue-100 hover:border-blue-200'
      }`}
      onClick={reviewerMode && request.student ? () => onViewStudent?.(request.student) : undefined}
      role={reviewerMode && request.student ? "button" : undefined}
      tabIndex={reviewerMode && request.student ? 0 : undefined}
      onKeyDown={reviewerMode && request.student ? (e) => { if (e.key === "Enter" || e.key === " ") onViewStudent?.(request.student); } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {reviewerMode ? (
            <>
              <img src={request.student?.avatar} alt={request.student?.name} className="h-12 w-12 rounded-xl object-cover ring-2 ring-indigo-50" />
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">{request.student?.name}</h3>
                <p className="text-[11px] text-slate-500 font-semibold truncate">{request.student?.studentCode} • {request.student?.major}</p>
              </div>
            </>
          ) : (
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{team.name}</h3>
              <p className="mt-0.5 text-xs text-slate-500">Trưởng nhóm: {team.leader?.name ?? "Chưa có"}</p>
            </div>
          )}
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shrink-0 ${
          request.status === "APPROVED"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
            : request.status === "REJECTED"
            ? "bg-red-50 text-red-700 border border-red-100"
            : "bg-amber-50 text-amber-700 border border-amber-100"
        }`}>
          {requestStatusLabel(request.status)}
        </span>
      </div>

      {reviewerMode ? (
        <p className="mt-3 text-xs leading-relaxed text-slate-600 bg-slate-50 rounded-xl px-3 py-2.5 italic">
          "{request.message || "Không có lời nhắn"}"
        </p>
      ) : (
        <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2">{team.description}</p>
      )}

      {/* Skills */}
      <div className="mt-3 flex flex-wrap gap-1">
        {((reviewerMode ? request.student?.skills : team.skills) ?? []).map((skill) => (
          <span key={skill} className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">{skill}</span>
        ))}
      </div>

      {reviewerMode && request.status === "PENDING" ? (
        <div className="mt-4 grid gap-2 grid-cols-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onUpdateStatus(request.id, "APPROVED"); }}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition"
          >
            <Check size={14} />
            Duyệt
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onUpdateStatus(request.id, "REJECTED"); }}
            className="inline-flex h-9 items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-700 hover:bg-red-100 active:scale-95 transition"
          >
            <X size={14} />
            Từ chối
          </button>
        </div>
      ) : null}

      {!reviewerMode && request.status !== "APPROVED" ? (
        <button
          type="button"
          onClick={() => onCancelJoinRequest?.(request.id)}
          className="mt-4 inline-flex h-9 w-full items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-700 hover:bg-red-100 active:scale-95 transition"
        >
          <X size={14} />
          Hủy yêu cầu
        </button>
      ) : null}
    </article>
  );
}

function RequestList({ title, subtitle, requests, reviewerMode, onUpdateJoinRequestStatus, onCancelJoinRequest, onViewStudent }) {
  if (!requests.length) return null;

  return (
    <section className="mt-10">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-black tracking-normal text-slate-900">{title}</h2>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {requests.map((request) => (
          <RequestedTeamCard
            key={request.id}
            request={request}
            reviewerMode={reviewerMode}
            onUpdateStatus={onUpdateJoinRequestStatus}
            onCancelJoinRequest={onCancelJoinRequest}
            onViewStudent={onViewStudent}
          />
        ))}
      </div>
    </section>
  );
}

export default function MyTeamPage({ profile, teams, joinRequests = [], onFindTeam, onCreateTeam, onJoinGroup, onUpdateJoinRequestStatus, onCancelJoinRequest, onViewStudent, onReviewMember, onLeaveTeam, onDeleteTeam }) {
  const myTeam = profile?.status === "IN_TEAM"
    ? teams.find((team) => team.members?.some((member) => member.id === profile?.id))
    : null;
  const requestedTeamIds = new Set(joinRequests.map((request) => request.teamId));
  const suggestedTeams = teams.slice(0, 3);
  
  const progressPercent = myTeam ? Math.round(((myTeam.members?.length ?? 0) / myTeam.maxMembers) * 100) : 0;
  const isCurrentUserLeader = myTeam?.leaderId === profile?.id;

  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      {myTeam ? (
        <div className="space-y-10">
          {/* Hero Banner Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-850 to-purple-900 p-8 text-white shadow-xl">
            {/* Background decorative elements */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {myTeam.status}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    <Target size={12} className="text-amber-300" />
                    Mục tiêu: {myTeam.targetGrade}
                  </span>
                </div>
                
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">{myTeam.name}</h1>
                <p className="max-w-2xl text-sm leading-relaxed text-indigo-100/90">{myTeam.description}</p>
              </div>

              {/* Stats / Progress */}
              <div className="shrink-0 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10 w-full md:w-64">
                <span className="text-xs font-semibold text-indigo-200">Sĩ số nhóm</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-black">{myTeam.members?.length ?? 0}</span>
                  <span className="text-indigo-300">/ {myTeam.maxMembers} thành viên</span>
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-2 text-right text-[10px] text-indigo-200 font-bold uppercase tracking-wider">
                  {progressPercent}% hoàn thành
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onLeaveTeam?.(myTeam)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <LogOut size={16} />
              Rời nhóm
            </button>
            {isCurrentUserLeader ? (
              <button
                type="button"
                onClick={() => onDeleteTeam?.(myTeam)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
              >
                <Trash2 size={16} />
                Xóa nhóm
              </button>
            ) : null}
          </div>

          {/* Two Column details */}
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left side: Members List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-900">Thành viên trong nhóm</h2>
                <p className="text-xs text-slate-500 mt-1">Danh sách cộng sự đồng hành cùng bạn trong học kỳ này.</p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                {myTeam.members?.map((member) => {
                  const isLeader = member.id === myTeam.leaderId;
                  const isCurrentUser = member.id === profile?.id;
                  const memberRating = Number(member.rating ?? 5);
                  const memberRatingText = Number.isInteger(memberRating) ? memberRating.toFixed(0) : memberRating.toFixed(1);
                  
                  return (
                    <article 
                      key={member.id} 
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-slate-300"
                      role="button"
                      tabIndex={0}
                      onClick={() => onViewStudent?.(member)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") onViewStudent?.(member);
                      }}
                    >
                      {/* Top Accent line */}
                      <div className={`absolute top-0 left-0 right-0 h-1.5 ${isLeader ? 'bg-amber-500' : isCurrentUser ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
                      
                      <div className="flex gap-4">
                        {/* Avatar container */}
                        <div className="relative shrink-0">
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className={`h-16 w-16 rounded-2xl object-cover ring-4 ${
                              isLeader ? 'ring-amber-500/20 ring-offset-2' : isCurrentUser ? 'ring-blue-600/20 ring-offset-2' : 'ring-slate-100'
                            }`} 
                          />
                          {isLeader && (
                            <span className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-xl bg-amber-500 text-white shadow-md">
                              <Crown size={12} />
                            </span>
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <h3 className="truncate text-base font-bold text-slate-900 group-hover:text-blue-600 transition">{member.name}</h3>
                            {isCurrentUser && (
                              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 shrink-0">Bạn</span>
                            )}
                            {isLeader && (
                              <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 shrink-0">Trưởng nhóm</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">{member.studentCode}</p>
                          <a 
                            href={`mailto:${member.email}`} 
                            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition mt-2 truncate w-full"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <Mail size={12} />
                            {member.email}
                          </a>
                        </div>
                      </div>
                      
                      {/* Member stats/details */}
                      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                        <div>
                          <span className="block text-[10px] text-slate-400 font-semibold uppercase">Mục tiêu</span>
                          <span className="font-bold text-slate-800">{member.targetGrade}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 font-semibold uppercase">Cam kết</span>
                          <span className="font-bold text-slate-800">{member.commitmentHours}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 font-semibold uppercase">Đánh giá</span>
                          <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                            <Star size={13} fill="currentColor" />
                            {memberRatingText}
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mt-4 flex flex-wrap gap-1">
                        {(member.skills ?? []).map((skill) => (
                          <span 
                            key={skill} 
                            className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {!isCurrentUser ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onReviewMember?.(member);
                          }}
                          className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                        >
                          <MessageSquarePlus size={15} />
                          Đánh giá thành viên
                        </button>
                      ) : null}

                      {member.bio && (
                        <p className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500 italic line-clamp-2">
                          "{member.bio}"
                        </p>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Right side: Commitments and info */}
            <div className="lg:col-span-4 space-y-6">
              {/* Commitments Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
                    <ClipboardList size={16} />
                  </span>
                  <h3 className="font-bold text-slate-900">Cam kết của nhóm</h3>
                </div>
                
                <ul className="mt-4 space-y-3">
                  {(myTeam.commitments ?? []).map((commitment) => (
                    <li key={commitment} className="flex gap-2.5 items-start text-xs text-slate-600">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600 mt-0.5">
                        <Check size={12} />
                      </span>
                      <span>{commitment}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills Needed Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-50 text-blue-600">
                    <Sparkles size={16} />
                  </span>
                  <h3 className="font-bold text-slate-900">Kỹ năng nhóm tìm kiếm</h3>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(myTeam.skills ?? []).map((skill) => (
                    <span 
                      key={skill} 
                      className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Join Requests for Leader */}
          {profile?.id === myTeam.leaderId && (
          <RequestList
            title="Yêu cầu xin vào nhóm của bạn"
            subtitle="Dùng chức năng duyệt hoặc từ chối để cập nhật thành viên nhóm."
            requests={joinRequests}
            reviewerMode
            onUpdateJoinRequestStatus={onUpdateJoinRequestStatus}
            onCancelJoinRequest={onCancelJoinRequest}
            onViewStudent={onViewStudent}
          />
          )}
        </div>
      ) : (
        <>
          <section className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-b from-blue-50/70 to-white px-5 py-14 text-center shadow-sm sm:py-16">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-blue-100 text-blue-600">
              <Users size={42} />
            </div>
            <h2 className="mt-6 text-2xl font-black tracking-normal text-slate-950">Bạn hiện chưa có nhóm</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Khám phá danh sách nhóm phù hợp với kỹ năng và mục tiêu của bạn,
              <br className="hidden sm:block" />
              hoặc tự tạo nhóm mới và trở thành trưởng nhóm.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={onFindTeam} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700">
                <Search size={17} />
                Tìm nhóm ngay
              </button>
              <button onClick={onCreateTeam} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-900 shadow-sm hover:bg-slate-50">
                <UserPlus size={17} />
                Tạo nhóm mới
              </button>
            </div>
          </section>

          <RequestList
            title="Nhóm bạn đã xin gia nhập"
            subtitle="Theo dõi trạng thái các yêu cầu đang chờ trưởng nhóm xử lý."
            requests={joinRequests}
            reviewerMode={false}
            onUpdateJoinRequestStatus={onUpdateJoinRequestStatus}
            onCancelJoinRequest={onCancelJoinRequest}
          />

          <section className="mt-10">
            <h2 className="text-2xl font-black tracking-normal text-slate-950">Nhóm gợi ý cho bạn</h2>
            <p className="mt-2 text-sm text-slate-500">Dựa trên kỹ năng mềm, mục tiêu và mức độ cam kết của bạn.</p>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {suggestedTeams.filter((group) => !requestedTeamIds.has(group.id)).map((group) => (
                <GroupCard key={group.id} group={group} currentStudentId={profile?.id} joinRequests={joinRequests} onJoin={onJoinGroup} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
