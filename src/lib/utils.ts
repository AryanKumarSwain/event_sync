export function formatTimeAgo(timestampMs: number): string {
  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestampMs) / 1000));
  if (diffSeconds < 45) return "Just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}

export function getStatusColor(status: string): {
  badgeBg: string;
  badgeText: string;
  dotColor: string;
  borderColor: string;
} {
  const st = (status || "").toUpperCase().trim();
  switch (st) {
    case "LIVE":
    case "IN_PROGRESS":
      return {
        badgeBg: "bg-red-600 text-white border-red-700 shadow-sm",
        badgeText: "text-red-700",
        dotColor: "bg-white",
        borderColor: "border-red-600",
      };
    case "READY":
    case "READY_ON_STAGE":
      return {
        badgeBg: "bg-blue-50 text-blue-700 border-blue-200 shadow-2xs",
        badgeText: "text-blue-700",
        dotColor: "bg-blue-600",
        borderColor: "border-blue-200",
      };
    case "PAUSED":
      return {
        badgeBg: "bg-amber-50 text-amber-900 border-amber-300 shadow-sm",
        badgeText: "text-amber-800",
        dotColor: "bg-amber-600",
        borderColor: "border-amber-300",
      };
    case "COMPLETED":
    case "PERFORMED":
      return {
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs",
        badgeText: "text-emerald-700",
        dotColor: "bg-emerald-600",
        borderColor: "border-emerald-300",
      };
    case "UPCOMING":
    case "SCHEDULED":
    case "NOT_STARTED":
    case "NOT PERFORMED":
    case "NOT_PERFORMED":
    case "PENDING":
      return {
        badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
        badgeText: "text-blue-700",
        dotColor: "bg-blue-600",
        borderColor: "border-blue-200",
      };
    case "CANCELLED":
    case "SKIPPED":
      return {
        badgeBg: "bg-rose-50 text-rose-800 border-rose-300",
        badgeText: "text-rose-700",
        dotColor: "bg-rose-600",
        borderColor: "border-rose-300",
      };
    default:
      return {
        badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
        badgeText: "text-blue-700",
        dotColor: "bg-blue-600",
        borderColor: "border-blue-200",
      };
  }
}

export function getCategoryBadge(category?: string): {
  label: string;
  bg: string;
  text: string;
  border: string;
} {
  const cat = (category || "").toUpperCase().trim();
  if (cat.includes("CELEBRATION") || cat.includes("FUNCTION")) {
    return {
      label: "🎉 Celebration / Function",
      bg: "bg-purple-100",
      text: "text-purple-800 font-bold",
      border: "border-purple-200",
    };
  }
  switch (cat) {
    case "DANCE":
      return {
        label: "💃 Dance",
        bg: "bg-purple-100",
        text: "text-purple-800 font-bold",
        border: "border-purple-200",
      };
    case "MUSIC":
      return {
        label: "🎵 Music",
        bg: "bg-blue-100",
        text: "text-blue-800 font-bold",
        border: "border-blue-200",
      };
    case "DRAMA":
    case "PLAY":
      return {
        label: "🎭 Drama / Skit",
        bg: "bg-amber-100",
        text: "text-amber-900 font-bold",
        border: "border-amber-200",
      };
    case "SPEECH":
      return {
        label: "🎤 Speech",
        bg: "bg-sky-100",
        text: "text-sky-800 font-bold",
        border: "border-sky-200",
      };
    default:
      return {
        label: category || "🎉 Function",
        bg: "bg-purple-100",
        text: "text-purple-800 font-bold",
        border: "border-purple-200",
      };
  }
}

