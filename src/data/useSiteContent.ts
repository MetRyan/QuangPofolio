import { useCallback, useEffect, useState } from "react";
import { defaultContent } from "./defaultContent";
import { ADMIN_AUTH_KEY, CONTENT_STORAGE_KEY, type SiteContent } from "./types";

function deepMergeContent(base: SiteContent, override: Partial<SiteContent>): SiteContent {
  return {
    projects: override.projects ?? base.projects,
    curatedMoments: { ...base.curatedMoments, ...(override.curatedMoments ?? {}) },
    activities: override.activities ?? base.activities,
    about: {
      ...base.about,
      ...(override.about ?? {}),
      education: override.about?.education ?? base.about.education,
      experience: override.about?.experience ?? base.about.experience,
    },
    beyondWorkspace: {
      ...base.beyondWorkspace,
      ...(override.beyondWorkspace ?? {}),
      leadership: {
        ...base.beyondWorkspace.leadership,
        ...(override.beyondWorkspace?.leadership ?? {}),
        roles: override.beyondWorkspace?.leadership?.roles ?? base.beyondWorkspace.leadership.roles,
        programs:
          override.beyondWorkspace?.leadership?.programs ?? base.beyondWorkspace.leadership.programs,
        hiddenImages:
          override.beyondWorkspace?.leadership?.hiddenImages ??
          base.beyondWorkspace.leadership.hiddenImages,
      },
    },
  };
}

export function loadContentFromStorage(): SiteContent | null {
  try {
    const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!raw) return null;
    return deepMergeContent(defaultContent, JSON.parse(raw) as Partial<SiteContent>);
  } catch {
    return null;
  }
}

export function saveContentToStorage(content: SiteContent) {
  localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  window.dispatchEvent(new Event("site-content-updated"));
}

export function clearContentStorage() {
  localStorage.removeItem(CONTENT_STORAGE_KEY);
  window.dispatchEvent(new Event("site-content-updated"));
}

export function isAdminAuthenticated(): boolean {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "1";
}

export function setAdminAuthenticated(value: boolean) {
  if (value) sessionStorage.setItem(ADMIN_AUTH_KEY, "1");
  else sessionStorage.removeItem(ADMIN_AUTH_KEY);
}

/** Simple personal password — đổi tại đây nếu cần */
export const ADMIN_PASSWORD = "Quang0804@";

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const fromStorage = loadContentFromStorage();
    if (fromStorage) {
      setContent(fromStorage);
      setReady(true);
      return;
    }

    try {
      const res = await fetch(`/content.json?t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as Partial<SiteContent>;
        setContent(deepMergeContent(defaultContent, json));
      } else {
        setContent(defaultContent);
      }
    } catch {
      setContent(defaultContent);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("site-content-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("site-content-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  const updateContent = useCallback((next: SiteContent) => {
    setContent(next);
    saveContentToStorage(next);
  }, []);

  return { content, ready, updateContent, refresh, resetToDefault: () => {
    clearContentStorage();
    setContent(defaultContent);
  }};
}

export function projectGalleryImages(folder: string, maxImages: number): string[] {
  return Array.from({ length: maxImages }, (_, i) => `/assets/projects/${folder}/${i + 1}.jpg`);
}

export function curatedImageList(folder: string, maxImages: number, hiddenImages: number[]): string[] {
  const hidden = new Set(hiddenImages);
  return Array.from({ length: maxImages }, (_, i) => i + 1)
    .filter((n) => !hidden.has(n))
    .map((n) => `/assets/projects/${folder}/${n}.jpg`);
}
