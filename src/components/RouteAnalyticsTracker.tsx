import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initClarity, initGa4, trackPageView, trackSessionStart } from "../lib/analytics";

export function RouteAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    initGa4();
    trackSessionStart();
    initClarity();
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(path);
  }, [location.pathname, location.search, location.hash]);

  return null;
}
