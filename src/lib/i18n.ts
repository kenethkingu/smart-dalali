/**
 * i18next configuration for Proland
 *
 * CRITICAL: Do NOT add `lng` to this init config.
 * If `lng` is set, i18next uses it directly and skips the LanguageDetector
 * entirely — the user's saved localStorage choice never gets read, and the
 * language silently resets on every reload.
 *
 * Detection order: localStorage → browser navigator language → fallbackLng
 * Cache target: localStorage (key: 'proland-language')
 *
 * Translation review status:
 *   All Swahili strings are DRAFT. Priority review order:
 *     1. hero.body, trust.verified_desc, trust.visit_desc (trust/payment copy)
 *     2. steps.step3.desc (site-visit policy — legal-adjacent)
 *     3. nav.*, common.* (lower stakes)
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import sw from './locales/sw.json'

i18n
  .use(LanguageDetector)   // Must be .use()'d BEFORE .use(initReactI18next)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sw: { translation: sw },
    },
    fallbackLng: 'en',
    // No `lng` here — that's the bug that makes the detector not run
    supportedLngs: ['en', 'sw'],
    detection: {
      // Order matters: check localStorage first, then browser navigator
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'proland-language',
      // Avoid caching in cookie (unnecessary in a pure SPA)
      excludeCacheFor: ['cimode'],
    },
    interpolation: {
      escapeValue: false, // React already escapes, no double-escaping needed
    },
  })

export default i18n
