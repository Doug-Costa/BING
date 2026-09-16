"use client";

import React, { useState } from "react";
import { useThemeTokens } from "@/lib/theme-context";

interface ThemeLogoProps {
  variant?: "main" | "blue" | "gold" | "glow" | "transparent";
  width?: number | string;
  height?: number | string;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export function ThemeLogo({
  variant = "main",
  width = 160,
  height = "auto",
  className = "",
  alt = "Bingo Show",
}: ThemeLogoProps) {
  const tokens = useThemeTokens();
  const [hasError, setHasError] = useState(false);

  // Selecionar imagem conforme variante e tokens
  let logoSrc = tokens.assets.logos.main;
  if (variant === "blue" && tokens.assets.logos.blueSvg) logoSrc = tokens.assets.logos.blueSvg;
  if (variant === "gold" && tokens.assets.logos.goldSvg) logoSrc = tokens.assets.logos.goldSvg;
  if (variant === "glow" && tokens.assets.logos.glow) logoSrc = tokens.assets.logos.glow;
  if (variant === "transparent" && tokens.assets.logos.transparent) logoSrc = tokens.assets.logos.transparent;

  if (hasError) {
    // Fallback de texto estilizado se a imagem não carregar
    return (
      <div
        className={`theme-logo-fallback ${className}`}
        style={{
          fontFamily: tokens.typography.fontHeading,
          fontWeight: tokens.typography.weights.black,
          fontSize: "26px",
          color: tokens.colors.gold,
          textShadow: `0 0 10px ${tokens.colors.primary}`,
          letterSpacing: "1px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <span>BINGO</span>
        <span style={{ color: tokens.colors.cyan }}>SHOW</span>
      </div>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={`theme-logo-img ${className}`}
      onError={() => setHasError(true)}
      style={{
        display: "block",
        maxWidth: "100%",
        height: height === "auto" ? "auto" : `${height}px`,
        objectFit: "contain",
      }}
    />
  );
}
