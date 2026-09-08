import React, { Suspense } from "react";
import EventQueryClient from "./EventQueryClient";

export const dynamic = "force-dynamic";

export default function EventQueryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-emerald-700 font-mono text-sm">
          Loading Event Tracker...
        </div>
      }
    >
      <EventQueryClient />
    </Suspense>
  );
}
