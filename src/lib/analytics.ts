type GtagCommand = (...args: unknown[]) => void;
type ClarityCommand = ((...args: unknown[]) => void) & { q?: unknown[][] };
type GtagQueueEntry = IArguments | unknown[];

declare global {
  interface Window {
    dataLayer?: GtagQueueEntry[];
    gtag?: GtagCommand;
    clarity?: ClarityCommand;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";
const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim() ?? "";

let gaInitialized = false;
let clarityInitialized = false;
let lastTrackedPath = "";

function isLocalRuntime() {
  if (typeof window === "undefined") return true;
  const hostname = window.location.hostname.toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname.endsWith(".local");
}

function canTrack() {
  return import.meta.env.PROD && !isLocalRuntime();
}

function loadScriptOnce(scriptId: string, src: string, async = true) {
  if (typeof document === "undefined") return;
  if (document.getElementById(scriptId)) return;

  const script = document.createElement("script");
  script.id = scriptId;
  script.async = async;
  script.src = src;
  document.head.appendChild(script);
}

export function initGa4() {
  if (!canTrack() || !GA_MEASUREMENT_ID || typeof window === "undefined") return false;
  if (gaInitialized) return true;

  window.dataLayer = window.dataLayer ?? [];
  if (!window.gtag) {
    window.gtag = function gtag(this: Window) {
      window.dataLayer?.push(arguments);
    } as GtagCommand;
  }

  loadScriptOnce(
    "ga4-script",
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`
  );

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
  gaInitialized = true;
  return true;
}

export function trackSessionStart() {
  if (!initGa4() || typeof window === "undefined") return;

  const sessionFlag = "qwik_ga4_session_started";
  if (window.sessionStorage.getItem(sessionFlag)) return;

  window.gtag?.("event", "session_start");
  window.sessionStorage.setItem(sessionFlag, "1");
}

export function trackPageView(path: string) {
  if (!initGa4() || typeof window === "undefined" || !path) return;
  if (path === lastTrackedPath) return;

  lastTrackedPath = path;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function initClarity() {
  if (!canTrack() || !CLARITY_PROJECT_ID || typeof window === "undefined") return false;
  if (clarityInitialized) return true;

  const clarityFn: ClarityCommand = window.clarity ?? function clarity(...args: unknown[]) {
    clarityFn.q = clarityFn.q ?? [];
    clarityFn.q.push(args);
  };
  window.clarity = clarityFn;

  loadScriptOnce("clarity-script", `https://www.clarity.ms/tag/${encodeURIComponent(CLARITY_PROJECT_ID)}`);
  clarityInitialized = true;
  return true;
}
