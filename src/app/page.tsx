"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Radio,
  Search,
  Smartphone,
  School,
  Clock,
  ChevronRight,
  Layers,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import EventSearch from "@/components/EventSearch";
import { subscribeToPublicEvents } from "@/lib/firestoreService";
import { EventDoc } from "@/types/event";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const schoolQuery = searchParams.get("school");
  const idQuery = searchParams.get("id");

  // If both or either are passed, auto navigate if exact match
  useEffect(() => {
    if (idQuery) {
      router.push(`/event/${idQuery}`);
    }
  }, [idQuery, router]);

  // Subscribe to real-time events list
  useEffect(() => {
    const unsubscribe = subscribeToPublicEvents((list) => {
      setEvents(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const liveEventsCount = events.filter(
    (e) => e.status === "LIVE" || e.status === "IN_PROGRESS"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar isRealtime={true} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Glow ambient background effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl bg-gradient-to-b from-blue-100/70 via-indigo-100/40 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 left-10 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute top-1/4 right-10 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          {/* Top Banner Tag */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-[#F0F7FF] px-4 py-1.5 text-xs font-bold text-[#2563EB] shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#2563EB] animate-ping" />
              <span>Real-Time Live Sync Active</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">No App Required</span>
            </div>
          </div>

          {/* Main Hero Header */}
          <div className="mt-8 text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0F172A] leading-tight">
              Live School Events,{" "}
              <span className="bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#0F172A] bg-clip-text text-transparent">
                Stage Trackers
              </span>{" "}
              & Schedules
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Designed for audience members, parents, and students. Scan the QR code or search your school to view real-time stage performances, live timers, delays, and coordinator notices.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <a
                href="#events"
                className="flex items-center gap-2 rounded-2xl bg-[#2563EB] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <span>Find Your Event</span>
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
                {liveEventsCount}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-semibold">
                Live Stages Now
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                0s
              </div>
              <div className="text-xs text-slate-500 mt-1 font-semibold">
                Delay Latency (onSnapshot)
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
                100%
              </div>
              <div className="text-xs text-slate-500 mt-1 font-semibold">
                Public & Auth-Free
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-xs">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono">
                Android
              </div>
              <div className="text-xs text-slate-500 mt-1 font-semibold">
                Deep-Link Ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Search & Discovery Section */}
      <section id="events" className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                <Layers className="h-4 w-4" />
                <span>Live Directory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                Active School Events
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select an event to open the live stage monitor, schedule timeline, and coordinator announcements.
              </p>
            </div>
          </div>

          {/* Search and filtered list */}
          <EventSearch events={events} />
        </div>
      </section>

      {/* Deep Link Mobile App Banner */}
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50/70 p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>EventSync Android Mobile App</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Are you a student participant or teacher coordinator?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                  Install the native EventSync Android app to receive backstage cue buzzers, direct stage audio stream links, and role-based performance alerts.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="eventsync://home"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Launch EventSync App</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 font-medium">
        <div className="mx-auto max-w-7xl px-4">
          <p>© 2026 EventSync • Public Live Event Web Portal • Powered by Firebase Firestore v10+</p>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-blue-700 font-mono text-sm">
          Loading EventSync Portal...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}

