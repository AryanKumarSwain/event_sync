"use client";

import React, { useState, useEffect } from "react";
import { Smartphone, X, ChevronRight } from "lucide-react";

interface DeepLinkBannerProps {
  slugOrId: string;
  eventName: string;
  schoolId?: string;
}

export default function DeepLinkBanner({
  slugOrId,
  eventName,
  schoolId,
}: DeepLinkBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [targetUrl, setTargetUrl] = useState(`eventsync://event/${slugOrId}`);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userAgent = navigator.userAgent || "";
    const isAndroid = /android/i.test(userAgent);
    const fullPath = schoolId ? `event/${schoolId}/${slugOrId}` : `event/${slugOrId}`;

    // On Android Chrome, intent:// without package lock allows Android OS to route to any installed app matching scheme=eventsync
    const androidUrl = `intent://${fullPath}#Intent;scheme=eventsync;end;`;
    const schemeUrl = `eventsync://${fullPath}`;

    setTargetUrl(isAndroid ? androidUrl : schemeUrl);
  }, [slugOrId, schoolId]);

  const handleOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Also trigger direct scheme attempt as backup
    const fullPath = schoolId ? `event/${schoolId}/${slugOrId}` : `event/${slugOrId}`;
    const directScheme = `eventsync://${fullPath}`;
    
    // Create temporary hidden iframe for custom protocol fallback
    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = directScheme;
      document.body.appendChild(iframe);
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    } catch (err) {
      console.warn("Iframe fallback error:", err);
    }
  };

  if (dismissed) return null;

  return (
    <div className="fixed bottom-3 inset-x-3 sm:bottom-5 sm:right-6 sm:left-auto z-40 max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div className="relative flex items-center justify-between gap-3 overflow-hidden rounded-2xl border-2 border-blue-300 bg-white/95 p-3.5 shadow-2xl shadow-slate-400/25 backdrop-blur-xl ring-1 ring-blue-500/20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
            <Smartphone className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-300" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">
                Audience App
              </span>
              <span className="text-[10px] text-slate-300">•</span>
              <span className="text-[10px] text-slate-500 font-semibold">
                Low Latency
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900 truncate">
              Open Live in EventSync App
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={targetUrl}
            onClick={handleOpen}
            className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
          >
            <span>Open</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </a>

          <button
            onClick={() => setDismissed(true)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


