"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  School,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Smartphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EventDoc } from "@/types/event";
import { getStatusColor } from "@/lib/utils";

interface EventSearchProps {
  events: EventDoc[];
}

export default function EventSearch({ events }: EventSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === "" ||
        ev.name.toLowerCase().includes(term) ||
        ev.schoolName.toLowerCase().includes(term) ||
        ev.schoolId.toLowerCase().includes(term) ||
        ev.publicSlug.toLowerCase().includes(term) ||
        ev.venue.toLowerCase().includes(term);

      const matchesStatus =
        filterStatus === "ALL"
          ? true
          : filterStatus === "LIVE"
          ? ev.status === "LIVE" || ev.status === "IN_PROGRESS"
          : ev.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  return (
    <div className="space-y-8">
      {/* Search Bar & Status Filters */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Input field */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by School ID, Name, or Event Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {["ALL", "LIVE", "UPCOMING", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`rounded-xl px-4 py-3 text-xs font-bold whitespace-nowrap transition-all ${
                  filterStatus === status
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {status === "ALL"
                  ? "All Events"
                  : status === "LIVE"
                  ? "🔴 Live Now"
                  : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEvents.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-blue-200 bg-white p-12 text-center text-slate-500 shadow-sm">
            <School className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Matching Events Found</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try searching with another school code or clear search filters.
            </p>
          </div>
        ) : (
          paginatedEvents.map((ev) => {
            const statusStyle = getStatusColor(ev.status);
            const isLive = ev.status === "LIVE" || ev.status === "IN_PROGRESS";

            return (
              <div
                key={ev.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                {/* Event Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  {ev.imageUrl ? (
                    <img
                      src={ev.imageUrl}
                      alt={ev.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-tr from-slate-200 via-blue-100 to-slate-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs ${statusStyle.badgeBg}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusStyle.dotColor} ${
                          isLive ? "animate-ping" : ""
                        }`}
                      />
                      <span>{isLive ? "LIVE NOW" : ev.status}</span>
                    </span>
                  </div>

                  {/* School Code pill */}
                  <div className="absolute top-3 right-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-mono font-bold text-slate-700 backdrop-blur-md border border-slate-200 shadow-2xs">
                    {ev.schoolId}
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="text-xs font-bold text-blue-700">
                    {ev.schoolName}
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {ev.name}
                  </h3>

                  {/* Metadata */}
                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{ev.startTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={
                        ev.schoolId && (ev.publicSlug || ev.id)
                          ? `/event/${ev.schoolId}/${ev.publicSlug || ev.id}`
                          : `/event/${ev.publicSlug || ev.id}`
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      <span>Watch Live Tracker</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <a
                      href={
                        ev.schoolId && (ev.publicSlug || ev.id)
                          ? `eventsync://event/${ev.schoolId}/${ev.publicSlug || ev.id}`
                          : `eventsync://event/${ev.publicSlug || ev.id}`
                      }
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 px-2.5 py-2 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors"
                      title="Open in EventSync App"
                    >
                      <Smartphone className="h-3.5 w-3.5 text-blue-600" />
                      <span className="hidden sm:inline">App</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {filteredEvents.length > ITEMS_PER_PAGE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
            <span className="font-bold text-slate-900">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredEvents.length)}
            </span>{" "}
            of <span className="font-bold text-slate-900">{filteredEvents.length}</span> events
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

