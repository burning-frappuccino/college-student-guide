import { ANALYTICS_CONFIG } from "./analytics-config.js";

const CONSENT_KEY = "college-guide-analytics-consent";
let tagInitialized = false;

function hasValidMeasurementId() {
  return /^G-[A-Z0-9]+$/i.test(ANALYTICS_CONFIG.measurementId.trim());
}

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) || "pending";
  } catch {
    return "pending";
  }
}

function writeConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {}
}

function initializeTag() {
  if (!hasValidMeasurementId() || tagInitialized) return false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", ANALYTICS_CONFIG.measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    anonymize_ip: true
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ANALYTICS_CONFIG.measurementId)}`;
  document.head.append(script);
  tagInitialized = true;
  return true;
}

export function analyticsStatus() {
  if (!hasValidMeasurementId()) return "disabled";
  return readConsent();
}

export function initAnalytics() {
  if (analyticsStatus() === "granted") initializeTag();
}

export function grantAnalyticsConsent() {
  writeConsent("granted");
  initializeTag();
}

export function denyAnalyticsConsent() {
  writeConsent("denied");
}

export function shouldShowAnalyticsConsent() {
  return ANALYTICS_CONFIG.consentBanner && analyticsStatus() === "pending";
}

export function trackEvent(name, parameters = {}) {
  if (analyticsStatus() !== "granted") return;
  initializeTag();
  window.gtag?.("event", name, parameters);
}
