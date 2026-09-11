"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Radio,
  Clock,
  Calendar,
  MapPin,
  Flame,
  BellRing,
  ListOrdered,
  Info,
  ArrowLeft,
  Share2,
  RefreshCw,
  Trophy,
  Users,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import EventHeader from "@/components/EventHeader";
import SpotlightCard from "@/components/SpotlightCard";
import ScheduleTimeline from "@/components/ScheduleTimeline";
import AnnouncementsTab from "@/components/AnnouncementsTab";
import DeepLinkBanner from "@/components/DeepLinkBanner";
import {
  subscribeToEvent,
  subscribeToPerformances,
  subscribeToSchool,
  subscribeToEventUpdates,
} from "@/lib/firestoreService";
import {
  EventDoc,
  PerformanceDoc,
  SchoolSubscriptionDoc,
  EventUpdateDoc,
} from "@/types/event";

interface EventTrackerViewProps {
  slugOrId?: string;
  schoolId?: string;
  eventSlug?: string;
}

export default function EventTrackerView({
  slugOrId = "",
  schoolId,
  eventSlug,
}: EventTrackerViewProps) {
  const [event, setEvent] = useState<EventDoc | null>(null);
  const [school, setSchool] = useState<SchoolSubscriptionDoc | null>(null);
  const [performances, setPerformances] = useState<PerformanceDoc[]>([]);
  const [updates, setUpdates] = useState<EventUpdateDoc[]>([]);
  const [isRealtime, setIsRealtime] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tracker" | "schedule" | "updates" | "info">("tracker");

  // 1. Subscribe to event document
  useEffect(() => {
    setLoading(true);
    let unsubEvent: () => void;

    if (schoolId && eventSlug) {
      unsubEvent = subscribeToEvent(
        schoolId,
        eventSlug,
        (eventData, realtime) => {
          setEvent(eventData);
          setIsRealtime(realtime);
          setLoading(false);
        },
        (err) => {
          console.warn("Event subscription notice:", err);
          setLoading(false);
        }
      );
    } else {
      unsubEvent = subscribeToEvent(
        slugOrId || eventSlug || "",
        (eventData, realtime) => {
          setEvent(eventData);
          setIsRealtime(realtime);
          setLoading(false);
        },
        (err) => {
          console.warn("Event subscription notice:", err);
          setLoading(false);
        }
      );
    }

    return () => unsubEvent();
  }, [schoolId, eventSlug, slugOrId]);

  // 2. Subscribe to performances and updates when event is loaded
  useEffect(() => {
    if (!event) return;

    // Check if event document itself contains an embedded array of performances/schedule items
    const rawEvent = event as any;
    const embeddedPerfs: PerformanceDoc[] =
      rawEvent.performances || rawEvent.schedule || rawEvent.items || rawEvent.stageList || [];

    if (embeddedPerfs && embeddedPerfs.length > 0) {
      const mapped = embeddedPerfs.map((p: any, idx: number) => ({
        id: p.id || `emb_${idx}`,
        eventId: event.id,
        name: p.name || p.title || `Performance #${idx + 1}`,
        category: p.category || "OTHER",
        sequenceNumber: Number(p.sequenceNumber ?? p.sequence ?? idx + 1),
        status: p.status || "NOT_STARTED",
        plannedStartTime: p.plannedStartTime || p.startTime || "10:30 AM",
        plannedDurationMinutes: Number(p.plannedDurationMinutes ?? p.durationMinutes ?? 10),
        description: p.description || "",
        isApproved: typeof p.isApproved === "boolean" ? p.isApproved : true,
        actualDurationSeconds: Number(p.actualDurationSeconds ?? 0),
        participantsList: p.participantsList || p.participants || [],
        requestedByTeacherName: p.requestedByTeacherName || p.teacherName || "",
        musicName: p.musicName || p.trackName || "",
        youtubeLink: p.youtubeLink || p.videoLink || "",
      }));
      mapped.sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0));
      setPerformances(mapped);
    }

    const unsubPerformances = subscribeToPerformances(
      event.id,
      (perfs) => {
        setPerformances(perfs);
      },
      event.publicSlug || slugOrId
    );

    const unsubUpdates = subscribeToEventUpdates(
      event.id,
      (upds) => {
        if (upds && upds.length > 0) {
          setUpdates(upds);
        }
      },
      event.publicSlug || slugOrId
    );

    return () => {
      unsubPerformances();
      unsubUpdates();
    };
  }, [event, slugOrId]);

  // 3. Subscribe to school subscription details
  useEffect(() => {
    if (!event?.schoolId) return;

    const unsubSchool = subscribeToSchool(event.schoolId, (schoolData) => {
      setSchool(schoolData);
    });

    return () => unsubSchool();
  }, [event?.schoolId]);

  // Identify currently active on-stage performance
  const { currentPerformance, nextPerformance } = useMemo(() => {
    if (!performances || performances.length === 0) {
      return { currentPerformance: undefined, nextPerformance: undefined };
    }

    // 1. Check for IN_PROGRESS or LIVE
    let current = performances.find((p) => p.status === "IN_PROGRESS" || p.status === "LIVE");
    // 2. Or PAUSED or READY_ON_STAGE
    if (!current) {
      current = performances.find((p) => p.status === "PAUSED" || p.status === "READY_ON_STAGE");
    }

    // Find the next upcoming performance
    let next: PerformanceDoc | undefined;
    if (current) {
      next = performances.find(
        (p) =>
          p.sequenceNumber > current!.sequenceNumber &&
          (p.status === "NOT_STARTED" || p.status === "SCHEDULED" || p.status === "READY_ON_STAGE")
      );
    } else {
      next = performances.find(
        (p) => p.status === "NOT_STARTED" || p.status === "SCHEDULED"
      );
    }

    return { currentPerformance: current, nextPerformance: next };
  }, [performances]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 animate-pulse mb-4 shadow-sm">
          <Radio className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Connecting to EventSync Live Stage...</h2>
        <p className="text-xs text-slate-500 mt-1">Establishing real-time Firestore sync socket</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Navbar isRealtime={false} />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mb-4 shadow-sm">
            <Info className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Event Not Found</h1>
          <p className="mt-2 text-sm text-slate-500">
            We could not locate an event for identifier &quot;{slugOrId}&quot;. Please verify the school link or QR code.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Events Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar
        isRealtime={isRealtime}
        schoolName={school?.schoolName || event.schoolName}
        eventName={event.name}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>All School Events</span>
          </Link>

          {/* Quick sync status */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="hidden sm:inline">Real-time live sync:</span>
            <span className="font-mono text-blue-700 font-bold">Active</span>
          </div>
        </div>

        {/* 1. Header Banner & Info */}
        <EventHeader event={event} school={school} />

        {/* 2. Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "tracker"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <Radio className="h-4 w-4" />
            <span>Live Stage & Event Info</span>
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "schedule"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <ListOrdered className="h-4 w-4" />
            <span>Full Schedule ({performances.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("updates")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === "updates"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <BellRing className="h-4 w-4" />
            <span>Broadcasts & Notices ({updates.length})</span>
          </button>
        </div>

        {/* 3. Tab Contents */}
        {activeTab === "tracker" && (
          <div className="space-y-8">
            {/* Event & Venue Info (Displayed at top) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Details Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span>Event Information</span>
                </h3>
                <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-xs">Event Name:</span>
                    <span className="font-bold text-slate-900">{event.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Date:</span>
                    <span className="font-medium text-slate-800">{event.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Timing:</span>
                    <span className="font-medium text-slate-800">
                      {event.startTime} to {event.endTime || "Conclusion"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Venue:</span>
                    <span className="font-medium text-slate-800">{event.venue}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-xs">Event Status:</span>
                    <span className="inline-block font-mono font-bold text-emerald-700">
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* School Host Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" />
                  <span>Organizing Institution</span>
                </h3>
                <div className="flex items-center gap-4">
                  {school?.schoolLogo ? (
                    <img
                      src={school.schoolLogo}
                      alt={school.schoolName}
                      className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-emerald-700 font-bold border border-slate-200">
                      ESC
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {school?.schoolName || event.schoolName}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      School Code: {event.schoolId}
                    </p>
                    <span className="mt-1 inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      Verified Host
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-600 leading-relaxed">
                  This event is streamed live via the EventSync school coordination platform. Stage cues, participant checklists, and audio timings are managed by the school event team.
                </div>
              </div>
            </div>

            {/* Winners banner if declared */}
            {event.winnersAnnouncement && (
              <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 sm:p-5 flex items-start gap-3 shadow-sm">
                <Trophy className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Winners Announced!
                  </div>
                  <p className="text-xs sm:text-sm text-slate-900 mt-1 font-medium">
                    {event.winnersAnnouncement}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Next Schedule Preview (Vertical List) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Upcoming Lineup Preview
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab("schedule")}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View All ({performances.length}) →
                </button>
              </div>

              <div className="flex flex-col space-y-3">
                {performances.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500 font-semibold">
                    No scheduled performances available.
                  </div>
                ) : (
                  performances.slice(0, 5).map((perf) => {
                    const isLive = perf.status === "IN_PROGRESS" || perf.status === "LIVE";
                    const isCompleted = perf.status === "COMPLETED" || perf.status === "PERFORMED";
                    const isPaused = perf.status === "PAUSED";
                    const isReady = perf.status === "READY" || perf.status === "READY_ON_STAGE";

                    return (
                      <div
                        key={perf.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 text-xs transition-all ${
                          isLive
                            ? "border-red-300 bg-red-50/30 shadow-xs"
                            : isPaused
                            ? "border-amber-300 bg-amber-50/50 shadow-xs"
                            : isCompleted
                            ? "border-emerald-200 bg-emerald-50/30"
                            : isReady
                            ? "border-blue-200 bg-blue-50/30"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 font-mono font-bold text-slate-800 text-xs">
                            #{perf.sequenceNumber}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-sm truncate">
                              {perf.name}
                            </div>
                            {perf.description && (
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                                {perf.description}
                              </p>
                            )}
                            <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                              {perf.category || "OTHER"} • Planned: <span className="font-bold text-slate-700">{perf.plannedStartTime}</span> ({perf.plannedDurationMinutes}m)
                            </div>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-xl px-3 py-1 text-[11px] font-black uppercase tracking-wider border self-start sm:self-center ${
                            isLive
                              ? "bg-red-600 text-white border-red-700 shadow-2xs"
                              : isPaused
                              ? "bg-amber-500 text-white border-amber-600 shadow-2xs"
                              : isCompleted
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isReady
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {isLive ? "LIVE NOW" : isPaused ? "PAUSED" : isCompleted ? "COMPLETED" : isReady ? "READY" : perf.status || "NOT_STARTED"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Recent Updates Snapshot */}
            {updates.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Latest Stage Broadcast
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("updates")}
                    className="text-xs font-bold text-emerald-700 hover:underline"
                  >
                    All Updates ({updates.length}) →
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold text-emerald-700">
                      {updates[0].senderName}
                    </span>
                    <span>Recent Broadcast</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800">
                    {updates[0].message}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Full Event Schedule</h2>
                <p className="text-xs text-slate-500">
                  Total {performances.length} stage performances scheduled
                </p>
              </div>
            </div>
            <ScheduleTimeline performances={performances} />
          </div>
        )}

        {activeTab === "updates" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Live Broadcasts & Stage Announcements
              </h2>
              <p className="text-xs text-slate-500">
                Direct public feed updated in real-time by the organizing committee
              </p>
            </div>
            <AnnouncementsTab
              updates={updates}
              winnersAnnouncement={event.winnersAnnouncement}
            />
          </div>
        )}
      </main>

      {/* Floating Bottom App Banner */}
      <DeepLinkBanner
        slugOrId={event.publicSlug || event.id}
        eventName={event.name}
      />
    </div>
  );
}
