"use client";

import React from "react";
import { useThemeTokens } from "@/lib/theme-context";

interface ThemeTextProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  variant?: "heading" | "title" | "body" | "caption" | "gold" | "secondary" | "muted";
  className?: string;
  style?: React.CSSProperties;
}

export function ThemeText({
  children,
  as: Component = "span",
  variant = "body",
  className = "",
  style = {},
}: ThemeTextProps) {
  const tokens = useThemeTokens();

  const variantStyles: Record<string, React.CSSProperties> = {
    heading: {
      fontFamily: tokens.typography.fontHeading,
      fontWeight: tokens.typography.weights.black,
      fontSize: "32px",
      textTransform: "uppercase",
      color: tokens.colors.textPrimary,
      letterSpacing: "0.5px",
    },
    title: {
      fontFamily: tokens.typography.fontHeading,
      fontWeight: tokens.typography.weights.bold,
      fontSize: "22px",
      color: tokens.colors.textPrimary,
    },
    body: {
      fontFamily: tokens.typography.fontPrimary,
      fontWeight: tokens.typography.weights.regular,
      fontSize: "15px",
      color: tokens.colors.textPrimary,
    },
    secondary: {
      fontFamily: tokens.typography.fontPrimary,
      fontWeight: tokens.typography.weights.medium,
      fontSize: "14px",
      color: tokens.colors.textSecondary,
    },
    muted: {
      fontFamily: tokens.typography.fontPrimary,
      fontWeight: tokens.typography.weights.regular,
      fontSize: "13px",
      color: tokens.colors.textMuted,
    },
    gold: {
      fontFamily: tokens.typography.fontHeading,
      fontWeight: tokens.typography.weights.black,
      color: tokens.colors.gold,
      textShadow: `0 0 12px ${tokens.colors.goldDark}`,
    },
    caption: {
      fontFamily: tokens.typography.fontPrimary,
      fontWeight: tokens.typography.weights.semibold,
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: tokens.colors.textMuted,
    },
  };

  return (
    <Component
      className={`theme-text theme-text-${variant} ${className}`}
      style={{
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </Component>
  );
}
