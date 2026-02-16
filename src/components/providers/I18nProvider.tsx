"use client";

import { I18nProvider as NextLocalizationProvider } from "next-localization";
import { useKioskStore } from "@/stores/useKioskStore";
import enMessages from "../../../messages/en.json";
import hiMessages from "../../../messages/hi.json";

const messages: Record<string, Record<string, string>> = {
  en: enMessages as Record<string, string>,
  hi: hiMessages as Record<string, string>,
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const language = useKioskStore((s) => s.language);
  const locale = language === "HI" ? "hi" : "en";
  const lngDict = messages[locale] ?? messages.en;

  return (
    <NextLocalizationProvider lngDict={lngDict} locale={locale}>
      <>{children}</>
    </NextLocalizationProvider>
  );
}
