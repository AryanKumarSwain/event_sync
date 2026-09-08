import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import {
  EventDoc,
  PerformanceDoc,
  SchoolSubscriptionDoc,
  EventUpdateDoc,
} from "@/types/event";

/**
 * Subscribe to an event in real-time by either its publicSlug or id
 */
export function subscribeToEvent(
  slugOrId: string,
  onUpdate: (event: EventDoc | null, isRealtime: boolean) => void,
  onError?: (err: Error) => void
): () => void {
  if (!slugOrId || !isFirebaseConfigured || !db) {
    onUpdate(null, false);
    return () => {};
  }

  let unsubscribeDoc: (() => void) | null = null;
  let unsubscribeSlug: (() => void) | null = null;

  try {
    const eventsRef = collection(db, "events");
    const slugQuery = query(
      eventsRef,
      where("publicSlug", "==", slugOrId),
      limit(1)
    );

    unsubscribeSlug = onSnapshot(
      slugQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data() as EventDoc;
          onUpdate({ ...docData, id: snapshot.docs[0].id || docData.id }, true);
        } else {
          // Fallback: listen to document by direct ID
          const directDocRef = doc(db!, "events", slugOrId);
          if (unsubscribeDoc) unsubscribeDoc();
          unsubscribeDoc = onSnapshot(
            directDocRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const data = docSnap.data() as EventDoc;
                onUpdate({ ...data, id: docSnap.id }, true);
              } else {
                onUpdate(null, false);
              }
            },
            (err) => {
              console.warn("Direct doc snapshot error:", err);
              onUpdate(null, false);
              if (onError) onError(err);
            }
          );
        }
      },
      (err) => {
        console.warn("Slug query snapshot error:", err);
        onUpdate(null, false);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.error("Error setting up event listener:", err);
    onUpdate(null, false);
  }

  return () => {
    if (unsubscribeSlug) unsubscribeSlug();
    if (unsubscribeDoc) unsubscribeDoc();
  };
}

/**
 * Subscribe to performances ordered by sequenceNumber asc in real-time.
 * Queries top-level 'performances' collection where eventId == selectedEventId.
 * Sorts client-side by sequenceNumber ascending to prevent missing composite index errors.
 */
export function subscribeToPerformances(
  eventId: string,
  onUpdate: (performances: PerformanceDoc[], isRealtime: boolean) => void,
  publicSlug?: string
): () => void {
  if (!eventId || !isFirebaseConfigured || !db) {
    onUpdate([], false);
    return () => {};
  }

  const resultsMap = new Map<string, Map<string, PerformanceDoc>>();

  const notifyAggregated = () => {
    const combinedMap = new Map<string, PerformanceDoc>();
    resultsMap.forEach((subMap) => {
      subMap.forEach((perf, id) => {
        combinedMap.set(id, perf);
      });
    });

    const list = Array.from(combinedMap.values());
    // Sort client-side by sequenceNumber ascending to prevent Firestore missing composite index errors
    list.sort((a, b) => (a.sequenceNumber || 0) - (b.sequenceNumber || 0));
    onUpdate(list, true);
  };

  const unsubscribers: (() => void)[] = [];

  const addListener = (key: string, q: any) => {
    try {
      const unsub = onSnapshot(
        q,
        (snapshot: any) => {
          const subMap = new Map<string, PerformanceDoc>();
          snapshot.docs.forEach((docSnap: any) => {
            const data = docSnap.data();
            const perf: PerformanceDoc = {
              id: docSnap.id,
              eventId: data.eventId || eventId,
              name: data.name || data.title || data.performanceName || "",
              sequenceNumber: Number(data.sequenceNumber ?? data.sequence ?? 0),
              plannedStartTime: data.plannedStartTime || data.startTime || "10:30 AM",
              plannedDurationMinutes: Number(data.plannedDurationMinutes ?? data.durationMinutes ?? 10),
              status: data.status || data.performanceStatus || "NOT_STARTED",
              description: data.description || "",
              isApproved: typeof data.isApproved === "boolean" ? data.isApproved : true,
              category: data.category || data.type || "OTHER",
              actualDurationSeconds: Number(data.actualDurationSeconds ?? 0),
              participantsList: data.participantsList || data.participants || [],
              requestedByTeacherName: data.requestedByTeacherName || data.teacherName || "",
              musicName: data.musicName || data.trackName || "",
              youtubeLink: data.youtubeLink || data.videoLink || "",
            };
            subMap.set(docSnap.id, perf);
          });
          resultsMap.set(key, subMap);
          notifyAggregated();
        },
        (err: any) => {
          console.warn(`Performances listener [${key}] notice:`, err);
        }
      );
      unsubscribers.push(unsub);
    } catch (e) {
      console.warn(`Failed to attach performances listener [${key}]:`, e);
    }
  };

  // Query top-level "performances" collection filtered by eventId
  const perfCollectionRef = collection(db, "performances");
  addListener("performances_eventId", query(perfCollectionRef, where("eventId", "==", eventId)));
  if (publicSlug && publicSlug !== eventId) {
    addListener("performances_publicSlug", query(perfCollectionRef, where("eventId", "==", publicSlug)));
  }

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
}

/**
 * Subscribe to school subscription branding by schoolId
 */
export function subscribeToSchool(
  schoolId: string,
  onUpdate: (school: SchoolSubscriptionDoc | null) => void
): () => void {
  if (!schoolId || !isFirebaseConfigured || !db) {
    onUpdate(null);
    return () => {};
  }

  try {
    const schoolDocRef = doc(db, "school_subscriptions", schoolId);
    return onSnapshot(
      schoolDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as SchoolSubscriptionDoc);
        } else {
          onUpdate(null);
        }
      },
      (err) => {
        console.warn("School subscription error:", err);
        onUpdate(null);
      }
    );
  } catch (err) {
    console.error("Firestore school error:", err);
    onUpdate(null);
    return () => {};
  }
}

/**
 * Subscribe to live event updates ordered by timestamp desc
 */
export function subscribeToEventUpdates(
  eventId: string,
  onUpdate: (updates: EventUpdateDoc[], isRealtime: boolean) => void,
  publicSlug?: string
): () => void {
  if (!eventId || !isFirebaseConfigured || !db) {
    onUpdate([], false);
    return () => {};
  }

  const resultsMap = new Map<string, Map<string, EventUpdateDoc>>();

  const notifyAggregated = () => {
    const combinedMap = new Map<string, EventUpdateDoc>();
    resultsMap.forEach((subMap) => {
      subMap.forEach((upd, id) => {
        combinedMap.set(id, upd);
      });
    });

    const list = Array.from(combinedMap.values());
    list.sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0));
    onUpdate(list, true);
  };

  const unsubscribers: (() => void)[] = [];

  const addListener = (key: string, q: any) => {
    try {
      const unsub = onSnapshot(
        q,
        (snapshot: any) => {
          const subMap = new Map<string, EventUpdateDoc>();
          snapshot.docs.forEach((docSnap: any) => {
            const data = docSnap.data();
            const upd: EventUpdateDoc = {
              id: docSnap.id,
              eventId: data.eventId || data.event_id || eventId,
              message: data.message || data.text || data.notice || "",
              senderName: data.senderName || data.sender || data.author || "Stage Coordinator",
              timestamp: Number(data.timestamp || data.createdAt || Date.now()),
            };
            subMap.set(docSnap.id, upd);
          });
          resultsMap.set(key, subMap);
          notifyAggregated();
        },
        (err: any) => {
          console.warn(`Event updates listener [${key}] error:`, err);
        }
      );
      unsubscribers.push(unsub);
    } catch (e) {
      console.warn(`Failed to attach event updates listener [${key}]:`, e);
    }
  };

  // Top-level query
  const updatesRef = collection(db, "event_updates");
  addListener("top_eventId", query(updatesRef, where("eventId", "==", eventId)));
  addListener("top_event_id", query(updatesRef, where("event_id", "==", eventId)));

  if (publicSlug && publicSlug !== eventId) {
    addListener("top_publicSlug", query(updatesRef, where("eventId", "==", publicSlug)));
  }

  // Subcollection query 'events/{eventId}/updates'
  try {
    const subRef = collection(db, "events", eventId, "updates");
    addListener("sub_eventId", subRef);
  } catch (e) {}

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
}

/**
 * Subscribe or fetch all public events for homepage discovery
 */
export function subscribeToPublicEvents(
  onUpdate: (events: EventDoc[]) => void
): () => void {
  if (!isFirebaseConfigured || !db) {
    onUpdate([]);
    return () => {};
  }

  try {
    const eventsRef = collection(db, "events");

    return onSnapshot(
      eventsRef,
      (snapshot) => {
        const list: EventDoc[] = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<EventDoc, "id">),
          }))
          .filter((ev) => ev.publicEnabled !== false);
        onUpdate(list);
      },
      (err) => {
        console.warn("Public events fetch error:", err);
        onUpdate([]);
      }
    );
  } catch (err) {
    console.error("Firestore public events error:", err);
    onUpdate([]);
    return () => {};
  }
}


