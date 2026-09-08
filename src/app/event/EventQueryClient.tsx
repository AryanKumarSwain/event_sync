"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import EventTrackerView from "@/components/EventTrackerView";

export default function EventQueryClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");
  const identifier = slug || id || "";

  return <EventTrackerView slugOrId={identifier} />;
}
