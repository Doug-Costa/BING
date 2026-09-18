"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { ThemeMode, ThemeOption, ThemeTokens } from "./theme/types";
import { AVAILABLE_THEMES, resolveTheme } from "./theme/themes";

export * from "./theme/types";
export { AVAILABLE_THEMES, resolveTheme } from "./theme/themes";

interface ThemeContextType {
  theme: ThemeMode;
  tokens: ThemeTokens;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  availableThemes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "blue",
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("bingo_theme") as ThemeMode | null;
      if (savedTheme && (savedTheme === "light" || savedTheme === "blue" || savedTheme === "ouro")) {
        setThemeState(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", defaultTheme);
      }
    } catch {
      document.documentElement.setAttribute("data-theme", defaultTheme);
    }
  }, [defaultTheme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("bingo_theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "blue" : "light";
    setTheme(next);
  };

  const tokens = useMemo(() => resolveTheme(theme), [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        tokens,
        setTheme,
        toggleTheme,
        availableThemes: AVAILABLE_THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function useThemeTokens(): ThemeTokens {
  const { tokens } = useTheme();
  return tokens;
}
