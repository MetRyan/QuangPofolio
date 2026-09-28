import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { LANGS, LANG_STORAGE_KEY, type Lang } from "./languages";
import { PHRASES, UI, type UiKey } from "./ui";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: UiKey) => string;
  tx: (text: string | undefined | null) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLang(): Lang {
  try {
    const raw = localStorage.getItem(LANG_STORAGE_KEY);
    if (raw && (LANGS as readonly string[]).includes(raw)) return raw as Lang;
  } catch {
    /* ignore */
  }
  return "vi";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    setLangState(readStoredLang());
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem(LANG_STORAGE_KEY, next);
    document.documentElement.lang = next === "zh" ? "zh-CN" : next;
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  }, [lang]);

  const t = useCallback((key: UiKey) => UI[key][lang] ?? UI[key].vi, [lang]);

  const tx = useCallback(
    (text: string | undefined | null) => {
      if (!text) return "";
      if (lang === "vi") return text;
      return PHRASES[text]?.[lang] ?? text;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t, tx }), [lang, setLang, t, tx]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      lang: "vi" as Lang,
      setLang: () => undefined,
      t: (key: UiKey) => UI[key].vi,
      tx: (text: string | undefined | null) => text ?? "",
    };
  }
  return ctx;
}
