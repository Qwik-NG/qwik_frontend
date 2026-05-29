import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const getPage = (): "auth" | "home" => {
    const page = new URLSearchParams(window.location.search).get("page");
    return page === "home" ? "home" : "auth";
  };

  const [page, setPage] = useState<"auth" | "home">(getPage);

  useEffect(() => {
    const handlePopState = () => setPage(getPage());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const goTo = (nextPage: "auth" | "home") => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", nextPage);
    window.history.pushState({}, "", url);
    setPage(nextPage);
  };

  return page === "home" ? <HomePage onNavigate={goTo} /> : <AuthPage onNavigate={goTo} />;
}
