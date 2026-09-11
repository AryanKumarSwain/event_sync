import React from "react";
import EventTrackerView from "@/components/EventTrackerView";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ schoolId: string; eventSlug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { schoolId, eventSlug } = await params;
  const formattedSchool = schoolId.replace(/-/g, " ").toUpperCase();
  const formattedEvent = eventSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${formattedEvent} (${formattedSchool}) | EventSync Live Stage`,
    description: `Watch live stage updates, performance timeline, and broadcasts for ${formattedEvent} at ${formattedSchool} on EventSync.`,
    openGraph: {
      title: `${formattedEvent} - ${formattedSchool} Live Stage`,
      description: `Real-time stage performance updates and event schedule for ${formattedEvent}.`,
    },
  };
}

export default async function SchoolEventSlugPage({ params }: PageProps) {
  const { schoolId, eventSlug } = await params;

  return (
    <EventTrackerView
      schoolId={schoolId}
      eventSlug={eventSlug}
      slugOrId={eventSlug}
    />
  );
}
