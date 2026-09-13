"use client";

import Link from "next/link";
import { CalendarDays, Home, Radio, Trophy, Users } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Início", icon: Home },
  { href: "/draws", label: "Sorteios", icon: CalendarDays },
  { href: "/live", label: "Ao vivo", icon: Radio },
  { href: "/#ganhadores", label: "Ganhadores", icon: Users },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-app-nav" aria-label="Navegação móvel principal">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = href === "/" ? pathname === "/" : pathname === href;
        return (
          <Link
            className={`mobile-nav-link ${isActive ? "active" : ""}`}
            href={href}
            key={href}
          >
            <div className="mobile-nav-icon-wrapper">
              <Icon className="mobile-nav-icon" />
            </div>
            <span className="mobile-nav-label">{label}</span>
            {isActive && <span className="mobile-nav-indicator" />}
          </Link>
        );
      })}
    </nav>
  );
}
