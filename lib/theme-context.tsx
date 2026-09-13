"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "blue";

export interface ThemeOption {
  id: ThemeMode;
  name: string;
  icon: string;
  description: string;
}

export const AVAILABLE_THEMES: ThemeOption[] = [
  {
    id: "light",
    name: "Tema Claro",
    icon: "☀️",
    description: "Visual moderno, limpo e vibrante",
  },
  {
    id: "blue",
    name: "Tema Azul Live",
    icon: "🌌",
    description: "Tema clássico e imersivo da sala ao vivo",
  },
];

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  availableThemes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("bingo_theme") as ThemeMode | null;
      if (savedTheme && (savedTheme === "light" || savedTheme === "blue")) {
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

  return (
    <ThemeContext.Provider
      value={{
        theme,
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
