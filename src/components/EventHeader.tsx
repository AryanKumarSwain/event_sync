"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  School,
  Check,
  Copy,
  MessageSquare,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { EventDoc, SchoolSubscriptionDoc } from "@/types/event";
import { getStatusColor, getCategoryBadge } from "@/lib/utils";

interface EventHeaderProps {
  event: EventDoc;
  school: SchoolSubscriptionDoc | null;
}

export default function EventHeader({ event, school }: EventHeaderProps) {
  const [copied, setCopied] = useState(false);
  const statusColors = getStatusColor(event.status);
  const catBadge = getCategoryBadge((event as any).category || "Celebration / Function");

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== "undefined") {
      const text = `🔴 Live Event Tracker: ${event.name} (${school?.schoolName || event.schoolName})\nWatch schedule and stage updates live: ${window.location.href}`;
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header Bar matching App Screenshot */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Search / Change School</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-mono font-bold text-slate-700 shadow-2xs">
          <School className="h-3.5 w-3.5 text-slate-500" />
          <span>{event.schoolId || "SCH-1001"}</span>
        </div>
      </div>

      {/* Main Event Banner Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        {/* Banner Poster */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-slate-100">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.name}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Info Box */}
        <div className="p-5 sm:p-8 space-y-4">
          {/* Top Tag Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-2xs">
              <Eye className="h-3.5 w-3.5" />
              <span>Public Live View</span>
            </span>

            {(() => {
              const isLive = event.status === "LIVE" || event.status === "IN_PROGRESS";
              return (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${statusColors.badgeBg}`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${statusColors.dotColor} ${
                      isLive ? "animate-ping" : ""
                    }`}
                  />
                  <span>{isLive ? "LIVE NOW" : event.status}</span>
                </span>
              );
            })()}
          </div>

          {/* Event Title */}
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
            {event.name}
          </h1>

          {/* School Name Card */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <School className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-slate-900">
                {school?.schoolName || event.schoolName}
              </span>
            </div>
            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-mono font-bold text-slate-700">
              {event.schoolId}
            </span>
          </div>

          {/* Category Pill */}
          <div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-bold ${catBadge.bg} ${catBadge.text} ${catBadge.border}`}
            >
              {catBadge.label}
            </span>
          </div>

          {/* Date / Time / Venue Details Strip */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900">{event.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900">
                  {event.startTime} {event.endTime ? `– ${event.endTime}` : ""}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
              <span className="font-medium text-slate-800">{event.venue}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Share via WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Public Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
