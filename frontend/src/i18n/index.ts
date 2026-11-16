// Internationalisation : anglais (défaut, à la racine) et français (sous /fr/).
// Le routage vient d'Astro (`i18n` dans astro.config.mjs) ; ici on ne garde que
// les dictionnaires et quelques helpers de chemins.
import en, { type Dictionary } from "./en";
import fr from "./fr";

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Dictionary> = { en, fr };

// Valeur de l'attribut <html lang>, de og:locale et de Intl.DateTimeFormat.
export const htmlLang: Record<Locale, string> = { en: "en", fr: "fr" };
export const ogLocale: Record<Locale, string> = { en: "en_US", fr: "fr_FR" };
export const dateLocale: Record<Locale, string> = { en: "en-US", fr: "fr-FR" };

// Nom de chaque langue dans sa propre langue (sélecteur de langue).
export const localeLabel: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export function isLocale(value: unknown): value is Locale {
  return (locales as readonly unknown[]).includes(value);
}

/** `Astro.currentLocale` peut être indéfini (ex. tests hors routage) : repli sur l'anglais. */
export function getLocale(current?: string): Locale {
  return isLocale(current) ? current : defaultLocale;
}

export function useT(current?: string): Dictionary {
  return dictionaries[getLocale(current)];
}

/** `/about/` -> `/about/` (en) ou `/fr/about/` (fr). `/` -> `/` ou `/fr/`. */
export function localePath(path: string, locale: Locale): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path === "/" ? "/" : path}`;
}

/** Sépare `/fr/blog/x/` en `{ locale: "fr", path: "/blog/x/" }`. */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return { locale, path: pathname.slice(locale.length + 1) || "/" };
    }
  }
  return { locale: defaultLocale, path: pathname };
}

/** Même page dans une autre langue (mêmes slugs dans les deux langues). */
export function alternatePath(pathname: string, target: Locale): string {
  return localePath(splitLocale(pathname).path, target);
}

/** `getStaticPaths` des pages sous `src/pages/[...locale]/` : une entrée par langue. */
export function localeStaticPaths() {
  return locales.map((locale) => ({
    params: { locale: locale === defaultLocale ? undefined : locale },
  }));
}
