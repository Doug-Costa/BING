"use client";

import React from "react";
import { useThemeTokens } from "@/lib/theme-context";

interface ThemeCardProps {
  children: React.ReactNode;
  variant?: "default" | "marked" | "winner";
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function ThemeCard({
  children,
  variant = "default",
  className = "",
  style = {},
  onClick,
}: ThemeCardProps) {
  const tokens = useThemeTokens();
  
  const cardBgAsset = 
    variant === "winner" ? tokens.assets.cards.cardWinner :
    variant === "marked" ? tokens.assets.cards.cardMarked :
    tokens.assets.cards.cardEmpty;

  const borderColor = 
    variant === "winner" ? tokens.colors.gold :
    variant === "marked" ? tokens.colors.primary :
    tokens.colors.border;

  return (
    <div
      className={`theme-card ${variant} ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: tokens.colors.bgSurface,
        backgroundImage: cardBgAsset ? `url(${cardBgAsset})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        border: `2px solid ${borderColor}`,
        borderRadius: "14px",
        boxShadow: variant === "winner" ? tokens.colors.shadowGlow : tokens.colors.shadowSubtle,
        color: tokens.colors.textPrimary,
        padding: "12px",
        position: "relative",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
