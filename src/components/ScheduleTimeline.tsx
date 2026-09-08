"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Music,
  Video,
  Users,
  Search,
} from "lucide-react";
import { PerformanceDoc } from "@/types/event";
import { getCategoryBadge } from "@/lib/utils";

interface ScheduleTimelineProps {
  performances: PerformanceDoc[];
}

export default function ScheduleTimeline({ performances }: ScheduleTimelineProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ["ALL", "DANCE", "MUSIC", "DRAMA", "SPEECH", "OTHER"];

  // Filter performances
  const filteredPerformances = performances.filter((perf) => {
    const categoryName = perf.category || "OTHER";
    const matchesCategory =
      selectedCategory === "ALL" ||
      categoryName.toUpperCase().includes(selectedCategory);

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      perf.name.toLowerCase().includes(query) ||
      perf.sequenceNumber.toString().includes(query) ||
      (perf.description && perf.description.toLowerCase().includes(query)) ||
      perf.requestedByTeacherName?.toLowerCase().includes(query) ||
      perf.participantsList?.some((p) => p.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const completedCount = performances.filter(
    (p) => p.status === "COMPLETED" || p.status === "PERFORMED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎭</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Event Schedule
          </h2>
        </div>
        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 font-mono">
          {completedCount} / {performances.length} Performed
        </span>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat === "ALL" ? "All Items" : cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search performance, student, track..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Performances Schedule Cards */}
      <div className="space-y-4">
        {filteredPerformances.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-8 text-center text-slate-500 shadow-xs">
            <p className="text-sm font-semibold">No performance items scheduled yet.</p>
          </div>
        ) : (
          filteredPerformances.map((perf) => {
            const isExpanded = expandedId === perf.id;
            const catBadge = getCategoryBadge(perf.category);
            const isOnStage = perf.status === "IN_PROGRESS" || perf.status === "LIVE";
            const isPaused = perf.status === "PAUSED";
            const isCompleted = perf.status === "COMPLETED" || perf.status === "PERFORMED";

            return (
              <div
                key={perf.id}
                className={`group rounded-3xl border bg-white shadow-sm transition-all duration-200 overflow-hidden ${
                  isOnStage
                    ? "border-2 border-blue-500 bg-blue-50/30 shadow-md shadow-blue-500/10"
                    : isPaused
                    ? "border-amber-400 bg-amber-50/30 shadow-xs"
                    : isCompleted
                    ? "border-slate-200 bg-slate-50/80 opacity-80"
                    : "border-slate-200 hover:border-blue-300"
                }`}
              >
                {/* Main Schedule Card Header */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Sequence Badge Circle */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-sm font-bold text-slate-700 border border-slate-200">
                        {perf.sequenceNumber}
                      </div>

                      {/* Title, Description & Planned timing */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">
                            #{perf.sequenceNumber}. {perf.name}
                          </h3>
                          {perf.isApproved !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                perf.isApproved
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {perf.isApproved ? "✓ Approved" : "Pending Approval"}
                            </span>
                          )}
                        </div>

                        {perf.description && (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {perf.description}
                          </p>
                        )}

                        <div className="text-xs text-slate-500 font-medium mt-1">
                          Planned: <span className="font-bold text-slate-800">{perf.plannedStartTime}</span> • {perf.plannedDurationMinutes} mins
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`shrink-0 rounded-xl px-3 py-1 text-[11px] font-black uppercase tracking-wider border ${
                        isOnStage
                          ? "bg-red-600 text-white border-red-700 shadow-2xs"
                          : isPaused
                          ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
                          : isCompleted
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {isOnStage ? "IN_PROGRESS" : isPaused ? "PAUSED" : isCompleted ? "COMPLETED" : perf.status || "NOT_STARTED"}
                    </span>
                  </div>

                  {/* Bottom Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-blue-700 font-bold">
                      <Music className="h-3.5 w-3.5 text-blue-600" />
                      <span>{perf.musicName || perf.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {perf.youtubeLink ? (
                        <a
                          href={perf.youtubeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-2xs"
                        >
                          <Video className="h-3.5 w-3.5 text-rose-600" />
                          <span>YouTube Track ↗</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => toggleExpand(perf.id)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900"
                        >
                          <span>{isExpanded ? "Less Info" : "Details"}</span>
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50 p-4 sm:px-6 space-y-3 text-xs text-slate-700">
                    {/* Category pill */}
                    <div>
                      <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${catBadge.bg} ${catBadge.text} ${catBadge.border}`}>
                        {catBadge.label}
                      </span>
                    </div>

                    {/* Description */}
                    {perf.description && (
                      <div className="space-y-1">
                        <div className="font-bold text-slate-700">Performance Overview:</div>
                        <p className="text-slate-600 leading-relaxed">{perf.description}</p>
                      </div>
                    )}

                    {/* Participants */}
                    {perf.participantsList && perf.participantsList.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-600">
                          <Users className="h-3.5 w-3.5 text-blue-600" />
                          <span>Student Participants:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {perf.participantsList.map((student, i) => (
                            <span
                              key={i}
                              className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-slate-800 font-medium shadow-2xs"
                            >
                              {student}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Metadata items */}
                    {perf.requestedByTeacherName && (
                      <div className="flex items-center gap-1 font-medium text-slate-700 pt-1">
                        <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                        <span>Teacher Coordinator: {perf.requestedByTeacherName}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

