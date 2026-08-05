"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AuthData } from "@/lib/types";
import { refreshAccessToken } from "@/lib/api";
import { MobileNav } from "./mobile-nav";
import { PwaExperience } from "./pwa-experience";

type ContextValue = {
  user: AuthData | null;
  setUser: (user: AuthData | null) => void;
  authOpen: boolean;
  setAuthOpen: (open: boolean) => void;
  authMode: "login" | "register";
  openAuth: (mode: "login" | "register") => void;
};

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthData | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const affiliate = new URLSearchParams(window.location.search).get("affiliate")?.trim();
    if (affiliate) localStorage.setItem("bingo_affiliate_id", affiliate);
    const saved = localStorage.getItem("bingo_user");
    if (saved) try {
      const parsed = JSON.parse(saved) as AuthData;
      const token = localStorage.getItem("bingo_token");
      if (token && !isExpired(token)) setUser(parsed);
      else if (localStorage.getItem("bingo_refresh_token")) refreshAccessToken().then(setUser).catch(() => {
        localStorage.removeItem("bingo_token"); localStorage.removeItem("bingo_refresh_token"); localStorage.removeItem("bingo_user");
      });
      else { localStorage.removeItem("bingo_token"); localStorage.removeItem("bingo_user"); }
    } catch {}
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const expired = () => { setUser(null); setAuthMode("login"); setAuthOpen(true); };
    const refreshed = (event: Event) => setUser((event as CustomEvent<AuthData>).detail);
    window.addEventListener("bingo:auth-expired", expired);
    window.addEventListener("bingo:auth-refreshed", refreshed);
    return () => { window.removeEventListener("bingo:auth-expired", expired); window.removeEventListener("bingo:auth-refreshed", refreshed); };
  }, []);

  const openAuth = (mode: "login" | "register") => { setAuthMode(mode); setAuthOpen(true); };
  return <AppContext.Provider value={{ user, setUser, authOpen, setAuthOpen, authMode, openAuth }}>{children}<MobileNav /><PwaExperience /></AppContext.Provider>;
}

function isExpired(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return typeof payload.exp === "number" && payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
