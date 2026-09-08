"use client";

import React, { useState, useEffect } from "react";
import {
  Radio,
  Clock,
  UserCheck,
  Music,
  Video,
  Users,
} from "lucide-react";
import { PerformanceDoc, EventStatus } from "@/types/event";
import { getCategoryBadge, formatDuration } from "@/lib/utils";

interface SpotlightCardProps {
  currentPerformance?: PerformanceDoc;
  nextPerformance?: PerformanceDoc;
  eventStatus: EventStatus;
}

export default function SpotlightCard({
  currentPerformance,
  nextPerformance,
  eventStatus,
}: SpotlightCardProps) {
  // Live stage duration timer
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    currentPerformance?.actualDurationSeconds || 0
  );

  useEffect(() => {
    setElapsedSeconds(currentPerformance?.actualDurationSeconds || 0);

    if (
      currentPerformance &&
      (currentPerformance.status === "IN_PROGRESS" || currentPerformance.status === "LIVE")
    ) {
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentPerformance, eventStatus]);

  if (!currentPerformance) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-dashed border-blue-200 bg-white p-8 text-center shadow-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
          <Clock className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Performance Currently on Stage</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
          {eventStatus === "UPCOMING"
            ? "The event has not started yet. Performances will appear here in real-time once the stage goes live!"
            : eventStatus === "PAUSED"
            ? "The stage is currently in an intermission or paused by the coordinators."
            : "All performances for this event have concluded or the schedule is pending."}
        </p>
        {nextPerformance && (
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs text-blue-800 font-medium">
            <span className="font-bold uppercase tracking-wider text-blue-700">
              Up Next:
            </span>
            <span>
              #{nextPerformance.sequenceNumber} {nextPerformance.name} (Planned:{" "}
              {nextPerformance.plannedStartTime})
            </span>
          </div>
        )}
      </div>
    );
  }

  const categoryStyle = getCategoryBadge(currentPerformance.category);
  const isOnStage = currentPerformance.status === "IN_PROGRESS" || currentPerformance.status === "LIVE";

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-blue-300 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 p-6 sm:p-8 shadow-xl shadow-blue-500/10">
      {/* Decorative ambient radial glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />

      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/90 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black tracking-wider uppercase border shadow-2xs ${
              isOnStage
                ? "bg-blue-600 border-blue-700 text-white"
                : "bg-sky-600 border-sky-700 text-white"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isOnStage ? "bg-white animate-ping" : "bg-white"
              }`}
            />
            <span>{isOnStage ? "Live On Stage Now" : currentPerformance.status || "Ready On Stage"}</span>
          </div>

          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
          >
            {categoryStyle.label}
          </span>
        </div>

        {/* Live Stage Timer */}
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-1.5 font-mono text-xs shadow-2xs">
          <Clock className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-slate-500 font-sans">Duration:</span>
          <span className="font-bold text-slate-900 text-sm">
            {formatDuration(elapsedSeconds)}
          </span>
          <span className="text-[11px] text-slate-400 font-sans">
            / {currentPerformance.plannedDurationMinutes}m est.
          </span>
        </div>
      </div>

      {/* Main Performance Content */}
      <div className="mt-5 space-y-4">
        <div>
          <div className="text-xs font-mono font-bold tracking-wider text-blue-700 uppercase">
            Performance #{currentPerformance.sequenceNumber}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 mt-1">
            {currentPerformance.name}
          </h2>
        </div>

        {/* Participants Pill List */}
        {currentPerformance.participantsList &&
          currentPerformance.participantsList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Users className="h-3.5 w-3.5 text-blue-600" />
                <span>Participants ({currentPerformance.participantsList.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentPerformance.participantsList.map((participant, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    {participant}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Metadata Details Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-700">
          {currentPerformance.requestedByTeacherName && (
            <div className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 border border-slate-200 font-medium shadow-2xs">
              <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
              <span>Coordinator: {currentPerformance.requestedByTeacherName}</span>
            </div>
          )}

          {currentPerformance.musicName && (
            <div className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 border border-slate-200 font-medium shadow-2xs">
              <Music className="h-3.5 w-3.5 text-blue-600" />
              <span className="truncate max-w-xs">
                Track: {currentPerformance.musicName}
              </span>
            </div>
          )}

          {currentPerformance.youtubeLink && (
            <a
              href={currentPerformance.youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1.5 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors font-medium shadow-2xs"
            >
              <Video className="h-3.5 w-3.5 text-rose-600" />
              <span>Watch Video Track</span>
            </a>
          )}
        </div>
      </div>

      {/* Up Next Banner Footer */}
      {nextPerformance && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white/90 p-3.5 sm:px-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Up Next:
            </span>
            <span className="text-xs font-bold text-slate-900">
              #{nextPerformance.sequenceNumber} {nextPerformance.name}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Planned: {nextPerformance.plannedStartTime}</span>
            <span className="text-slate-300">•</span>
            <span>~{nextPerformance.plannedDurationMinutes}m</span>
          </div>
        </div>
      )}
    </div>
  );
}

