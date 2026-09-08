import React from "react";
import EventTrackerView from "@/components/EventTrackerView";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Live Stage Tracker - ${slug} | EventSync`,
    description: `Watch live stage tracker, current performances, and updates on EventSync for ${slug}.`,
  };
}

export default async function EventSlugPage({ params }: PageProps) {
  const { slug } = await params;

  return <EventTrackerView slugOrId={slug} />;
}
