import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { LANGS, LANG_META, type Lang } from "../i18n/languages";
import { useI18n } from "../i18n/LanguageContext";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-2 text-xs tracking-widest uppercase text-white/70 hover:text-white hover:border-white/30 transition-all cursor-pointer backdrop-blur-md"
        aria-label={t("lang.label")}
        aria-expanded={open}
      >
        <Globe size={14} />
        <span>{LANG_META[lang].short}</span>
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[180px] rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
          {LANGS.map((code: Lang) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-3 hover:bg-white/5 cursor-pointer",
                lang === code ? "text-white bg-white/10" : "text-white/60"
              )}
            >
              <span>{LANG_META[code].native}</span>
              <span className="text-[10px] tracking-widest opacity-50">{LANG_META[code].short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
