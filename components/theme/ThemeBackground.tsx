"use client";

import React from "react";
import { useThemeTokens } from "@/lib/theme-context";

interface ThemeBackgroundProps {
  children?: React.ReactNode;
  variant?: "main" | "dark" | "glow" | "blueGradient" | "space";
  className?: string;
  style?: React.CSSProperties;
  showOverlay?: boolean;
}

export function ThemeBackground({
  children,
  variant = "main",
  className = "",
  style = {},
  showOverlay = false,
}: ThemeBackgroundProps) {
  const tokens = useThemeTokens();
  const bgImage = tokens.assets.backgrounds[variant] || tokens.assets.backgrounds.main;

  return (
    <div
      className={`theme-background-wrapper ${className}`}
      style={{
        backgroundColor: tokens.colors.bgPage,
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100%",
        width: "100%",
        position: "relative",
        ...style,
      }}
    >
      {showOverlay && (
        <div
          className="theme-background-overlay"
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: tokens.mode === "dark" ? "rgba(2, 6, 23, 0.75)" : "rgba(248, 250, 252, 0.65)",
            backdropFilter: "blur(4px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
