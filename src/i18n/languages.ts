export const LANGS = ["vi", "en", "ko", "ja", "zh"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_META: Record<
  Lang,
  { label: string; native: string; short: string }
> = {
  vi: { label: "Tiếng Việt", native: "Tiếng Việt", short: "VI" },
  en: { label: "English", native: "English", short: "EN" },
  ko: { label: "한국어", native: "한국어", short: "KR" },
  ja: { label: "日本語", native: "日本語", short: "JP" },
  zh: { label: "中文", native: "中文", short: "CN" },
};

export const LANG_STORAGE_KEY = "quang_portfolio_lang";
