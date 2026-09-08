export type EventStatus = "UPCOMING" | "LIVE" | "PAUSED" | "COMPLETED" | "CANCELLED" | string;

export type PerformanceStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PAUSED"
  | "SCHEDULED"
  | "READY_ON_STAGE"
  | "PERFORMED"
  | string;

export type PerformanceCategory = "DANCE" | "MUSIC" | "DRAMA" | "SPEECH" | "OTHER" | string;

export interface EventDoc {
  id: string;
  name: string;
  publicSlug: string;
  schoolId: string;
  schoolName: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  imageUrl?: string;
  publicEnabled: boolean;
  publicScheduleEnabled: boolean;
  publicStatusEnabled: boolean;
  publicUpdatesEnabled: boolean;
  winnersAnnouncement?: string;
  actualStartTimeMillis?: number | null;
  pausedAtMillis?: number | null;
  totalPauseDurationMillis?: number;
}

export interface PerformanceDoc {
  id: string;
  eventId: string;
  name: string;
  sequenceNumber: number;
  plannedStartTime: string;
  plannedDurationMinutes: number;
  status: PerformanceStatus;
  description?: string;
  isApproved?: boolean;
  category?: PerformanceCategory;
  actualDurationSeconds?: number;
  participantsList?: string[];
  requestedByTeacherName?: string;
  musicName?: string;
  youtubeLink?: string;
}

export interface SchoolSubscriptionDoc {
  schoolId: string;
  schoolName: string;
  schoolLogo?: string;
  credits?: number;
}

export interface EventUpdateDoc {
  id: string;
  eventId: string;
  message: string;
  senderName: string;
  timestamp: number; // Unix epoch in ms
}
