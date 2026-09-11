import React from "react";
import EventTrackerView from "@/components/EventTrackerView";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const slugArray = slug || [];

  if (slugArray.length >= 2) {
    const schoolId = slugArray[0];
    const eventSlug = slugArray[1];
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

  const singleSlug = slugArray[0] || "Event";
  const formattedEvent = singleSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `Live Stage Tracker - ${formattedEvent} | EventSync`,
    description: `Watch live stage tracker, current performances, and updates on EventSync for ${formattedEvent}.`,
  };
}

export default async function EventSlugCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const slugArray = slug || [];

  if (slugArray.length >= 2) {
    const schoolId = slugArray[0];
    const eventSlug = slugArray.slice(1).join("/");
    return (
      <EventTrackerView
        schoolId={schoolId}
        eventSlug={eventSlug}
        slugOrId={eventSlug}
      />
    );
  }

  const singleSlug = slugArray[0] || "";
  return <EventTrackerView slugOrId={singleSlug} />;
}
