export function getAppDeepLinkUrls(slugOrId: string, schoolId?: string) {
  const cleanSlug = slugOrId || "";
  const cleanSchool = schoolId || "";

  // Multiple deep link format support
  const fullPath = cleanSchool ? `event/${cleanSchool}/${cleanSlug}` : `event/${cleanSlug}`;
  const customSchemeUrl = `eventsync://${fullPath}`;
  const directEventUrl = `eventsync://event/${cleanSlug}`;
  
  // Android Intent URI WITHOUT strict package restriction
  // This allows any installed version of EventSync to handle the eventsync:// scheme
  const androidIntentUrl = `intent://${fullPath}#Intent;scheme=eventsync;end;`;

  return {
    customSchemeUrl,
    directEventUrl,
    androidIntentUrl,
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.eventsync.app",
  };
}

export function openInApp(slugOrId: string, schoolId?: string) {
  if (typeof window === "undefined") return;

  const { customSchemeUrl, directEventUrl, androidIntentUrl } = getAppDeepLinkUrls(
    slugOrId,
    schoolId
  );

  const userAgent = navigator.userAgent || "";
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);

  // Strategy 1: Attempt direct custom scheme launch
  try {
    window.location.href = customSchemeUrl;
  } catch (e) {
    console.warn("Custom scheme attempt failed:", e);
  }

  // Strategy 2: For Android Chrome, trigger intent without package locking
  if (isAndroid) {
    setTimeout(() => {
      try {
        window.location.href = androidIntentUrl;
      } catch (e) {
        console.warn("Android intent attempt failed:", e);
      }
    }, 300);
  }
}
