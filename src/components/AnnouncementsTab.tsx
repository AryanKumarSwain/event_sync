"use client";

import React, { useState, useEffect } from "react";
import {
  BellRing,
  Trophy,
  Clock,
  User,
  Sparkles,
  Info,
} from "lucide-react";
import { EventUpdateDoc } from "@/types/event";
import { formatTimeAgo } from "@/lib/utils";

interface AnnouncementsTabProps {
  updates: EventUpdateDoc[];
  winnersAnnouncement?: string;
}

export default function AnnouncementsTab({
  updates,
  winnersAnnouncement,
}: AnnouncementsTabProps) {
  // Re-render time ago ticks every 30 seconds
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Winners Announcement Highlight Card */}
      {winnersAnnouncement && (
        <div className="relative overflow-hidden rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50/60 to-amber-50 p-6 sm:p-7 shadow-xl shadow-amber-500/10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-md shadow-amber-500/30">
              <Trophy className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-800 border border-amber-200">
                <Sparkles className="h-3 w-3" />
                <span>Official Winners Declaration</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-950">
                Event Results & Trophies
              </h3>
              <p className="text-sm leading-relaxed text-amber-950 font-semibold whitespace-pre-line pt-1">
                {winnersAnnouncement}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Live Feed */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <BellRing className="h-4 w-4 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Live Coordinator Broadcasts
              </h3>
              <p className="text-xs text-slate-500">
                Real-time announcements from stage managers & committee
              </p>
            </div>
          </div>

          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
            {updates.length} Updates
          </span>
        </div>

        {updates.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">
            <Info className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <span>No announcements have been published yet for this event.</span>
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {updates.map((update, index) => (
              <div key={update.id || index} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-xs">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-slate-300 hover:bg-white hover:shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-blue-700">
                      <User className="h-3 w-3" />
                      <span>{update.senderName}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(update.timestamp)}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                    {update.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

