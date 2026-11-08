"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

export type InterfaceLocale = "en" | "fr" | "es" | "it" | "de";

type InterfaceLanguageContextValue = {
  locale: InterfaceLocale;
  setLocale: (locale: InterfaceLocale) => void;
  persistenceError: string | null;
};

const LOCALE_STORAGE_KEY = "morrow:interface-language";
const locales: readonly string[] = ["en", "fr", "es", "it", "de"];
const subscribers = new Set<() => void>();
let sessionLocale: InterfaceLocale = "en";
let localeStorageError: string | null = null;
let sessionLocaleChanged = false;
const serverLocaleSnapshot = JSON.stringify({ locale: "en", error: null });

function notifyLocaleChange() {
  subscribers.forEach((subscriber) => subscriber());
}

function handleLocaleStorage(event: StorageEvent) {
  if (event.key !== LOCALE_STORAGE_KEY && event.key !== null) return;
  sessionLocaleChanged = false;
  localeStorageError = null;
  notifyLocaleChange();
}

function subscribeToLocale(subscriber: () => void) {
  subscribers.add(subscriber);
  window.addEventListener("storage", handleLocaleStorage);
  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) window.removeEventListener("storage", handleLocaleStorage);
  };
}

function getLocaleSnapshot() {
  let locale = sessionLocale;
  let error = localeStorageError;
  if (!sessionLocaleChanged) {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored && locales.includes(stored)) locale = stored as InterfaceLocale;
    } catch (cause) {
      error = cause instanceof Error ? `The interface language could not be read: ${cause.message}` : "The interface language could not be read.";
    }
  }
  return JSON.stringify({ locale, error });
}

function getServerLocaleSnapshot() {
  return serverLocaleSnapshot;
}

function isInterfaceLocale(locale: string): locale is InterfaceLocale {
  return locales.includes(locale);
}

const InterfaceLanguageContext = createContext<InterfaceLanguageContextValue | null>(null);

export function InterfaceLanguageProvider({ children }: { children: React.ReactNode }) {
  const localeSnapshotJson = useSyncExternalStore(subscribeToLocale, getLocaleSnapshot, getServerLocaleSnapshot);
  const localeSnapshot = useMemo(() => JSON.parse(localeSnapshotJson) as { locale: InterfaceLocale; error: string | null }, [localeSnapshotJson]);
  const { locale } = localeSnapshot;

  const setLocale = useCallback((nextLocale: InterfaceLocale) => {
    sessionLocale = nextLocale;
    sessionLocaleChanged = true;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      localeStorageError = null;
    } catch (cause) {
      localeStorageError = cause instanceof Error
        ? `The interface language is set for this visit but could not be saved: ${cause.message}`
        : "The interface language is set for this visit but could not be saved.";
    }
    notifyLocaleChange();
  }, []);

  const value = useMemo<InterfaceLanguageContextValue>(() => ({
    locale,
    setLocale,
    persistenceError: localeSnapshot.error,
  }), [locale, localeSnapshot.error, setLocale]);

  return (
    <InterfaceLanguageContext.Provider value={value}>
      <LocaleDocumentLanguage locale={locale} />
      {children}
    </InterfaceLanguageContext.Provider>
  );
}

function LocaleDocumentLanguage({ locale }: { locale: InterfaceLocale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}

export function useInterfaceLanguage() {
  const context = useContext(InterfaceLanguageContext);
  if (!context) throw new Error("useInterfaceLanguage must be used within InterfaceLanguageProvider");
  return context;
}

const localeOptions: { value: InterfaceLocale; label: string; flag: string }[] = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
];

export function InterfaceLanguageSelect({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, persistenceError } = useInterfaceLanguage();
  const labels: Record<InterfaceLocale, string> = {
    en: "Interface language",
    fr: "Langue de l’interface",
    es: "Idioma de la interfaz",
    it: "Lingua dell’interfaccia",
    de: "Sprache der Benutzeroberfläche",
  };

  return (
    <label className={`interface-language-select ${compact ? "is-compact" : ""}`} title={persistenceError ?? undefined}>
      <span aria-hidden="true">✳</span>
      <span className="sr-only">{labels[locale]}</span>
      <select value={locale} onChange={(event) => {
        if (isInterfaceLocale(event.target.value)) setLocale(event.target.value);
      }} aria-label={labels[locale]} aria-invalid={Boolean(persistenceError)}>
        {localeOptions.map((option) => (
          <option value={option.value} key={option.value}>{option.flag} {option.label}</option>
        ))}
      </select>
    </label>
  );
}
