"use client";

import Link from "next/link";
import { ThemeLogo } from "@/components/theme/ThemeLogo";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="Bingo Show - início">
      <ThemeLogo
        variant="main"
        alt="Bingo Show"
        style={{ height: "70px", width: "auto", maxWidth: "100%" }}
      />
    </Link>
  );
}
