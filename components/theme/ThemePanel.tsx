"use client";

import React from "react";
import { useThemeTokens } from "@/lib/theme-context";

interface ThemePanelProps {
  children: React.ReactNode;
  variant?: "main" | "glass" | "neon" | "dark" | "header" | "footer" | "modal" | "popup" | "sidebar";
  bordered?: boolean;
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function ThemePanel({
  children,
  variant = "main",
  bordered = true,
  glow = false,
  className = "",
  style = {},
}: ThemePanelProps) {
  const tokens = useThemeTokens();
  const panelBgAsset = tokens.assets.panels[variant];

  const defaultBorder = bordered ? `1px solid ${tokens.colors.border}` : "none";
  const defaultShadow = glow ? tokens.colors.shadowGlow : tokens.colors.shadowCard;

  return (
    <div
      className={`theme-panel ${className}`}
      style={{
        backgroundColor: tokens.colors.bgSurface,
        backgroundImage: panelBgAsset ? `url(${panelBgAsset})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: defaultBorder,
        borderRadius: "16px",
        boxShadow: defaultShadow,
        color: tokens.colors.textPrimary,
        padding: "16px",
        transition: "all 0.25s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
