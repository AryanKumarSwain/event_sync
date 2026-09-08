"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Radio,
  Smartphone,
  Search,
  ExternalLink,
  Sparkles,
  QrCode,
  X,
  CheckCircle2,
} from "lucide-react";

interface NavbarProps {
  isRealtime?: boolean;
  schoolName?: string;
  eventName?: string;
}

export default function Navbar({
  isRealtime = true,
  schoolName,
  eventName,
}: NavbarProps) {
  const [showAppModal, setShowAppModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-3 transition-transform active:scale-95"
            >
              <div className="relative flex h-10 items-center">
                <img
                  src="/logo.png"
                  alt="EventSync Logo"
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-[#0F172A] font-sans">
                    event<span className="text-[#38BDF8]">sync</span>
                  </span>
                  <span className="rounded-md bg-[#F0F7FF] px-1.5 py-0.5 text-[10px] font-bold text-[#2563EB] border border-sky-200 uppercase tracking-wider">
                    Live Portal
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  PLAN • MANAGE • SYNC
                </span>
              </div>
            </Link>
          </div>

          {/* Center Info (when viewing specific event) */}
          {eventName && (
            <div className="hidden lg:flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3.5 py-1 text-xs text-blue-900 font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="truncate max-w-xs">{eventName}</span>
            </div>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Realtime / Offline status pill */}
            <div
              className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                isRealtime
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-indigo-200 bg-indigo-50 text-indigo-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isRealtime ? "bg-blue-600 animate-ping" : "bg-indigo-500"
                }`}
              ></span>
              <span>{isRealtime ? "Live Sync Active" : "Interactive Mode"}</span>
            </div>

            {/* Google Play Store App Download Button */}
            <a
              href="https://play.google.com/store/apps/details?id=com.eventsync.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 transition-all hover:border-slate-300 hover:bg-slate-50 shadow-2xs active:scale-95"
              title="Download EventSync App on Google Play Store"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M47.781 14.594C44.42 18.064 42.5 23.47 42.5 30.641v450.718c0 7.172 1.92 12.578 5.281 16.047l1.094 1.063L275.5 271.844v-3.688L48.875 13.531l-1.094 1.063z" fill="#00D2FF"/>
                <path d="M352.938 349.313L275.5 271.844v-3.688l77.438-77.469 1.75 1.031 91.813 52.156c26.188 14.875 26.188 39.25 0 54.156l-91.813 52.25-1.75 1.032z" fill="#FFD200"/>
                <path d="M275.5 268.156L47.781 495.875c8.625 9.156 22.844 10.281 38.688 1.281l266.469-151.406-77.438-77.594z" fill="#FF3A44"/>
                <path d="M275.5 268.156l77.438-77.469L86.469 39.281c-15.844-9-30.063-7.875-38.688 1.281L275.5 268.156z" fill="#00E676"/>
              </svg>
              <span>Download App</span>
            </a>

            {/* Open App Banner Trigger */}
            <button
              onClick={() => setShowAppModal(true)}
              className="group flex items-center gap-2 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
            >
              <Smartphone className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline">Get Mobile App</span>
              <span className="sm:hidden">App</span>
            </button>
          </div>
        </div>
      </header>

      {/* App Download Modal */}
      {showAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowAppModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">EventSync Mobile</h3>
                <p className="text-xs text-slate-500">
                  Real-time Stage Control & Audience Experience
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 mb-5">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Zero latency stage timer countdown notifications</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Student participant alerts when your slot is up next</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Instant push updates directly from school stage crew</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="eventsync://home"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-98 transition-all"
              >
                <Smartphone className="h-4 w-4" />
                <span>Open in EventSync Android App</span>
              </a>

              <button
                onClick={() => {
                  alert(
                    "EventSync Android APK can be installed directly from your school admin portal or downloaded from the campus kiosk."
                  );
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                <span>Download Android APK / Install</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

