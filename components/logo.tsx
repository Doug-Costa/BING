"use client";

import Link from "next/link";
import { ThemeLogo } from "@/components/theme/ThemeLogo";

interface LogoProps {
  className?: string;
  height?: number | string;
  variant?: "main" | "blue" | "gold" | "glow" | "transparent";
}

export function Logo({ className = "", height = 44, variant = "main" }: LogoProps) {
  return (
    <Link className={`brand ${className}`} href="/" aria-label="Bingo Show - início">
      <ThemeLogo
        variant={variant}
        alt="Bingo Show"
        height={height}
        width="auto"
      />
    </Link>
  );
}

