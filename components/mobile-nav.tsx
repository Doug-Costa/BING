"use client";

import Link from "next/link";
import { CalendarDays, Home, Radio, UserRound, WalletCards } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  ["/", "Início", Home],
  ["/draws", "Sorteios", CalendarDays],
  ["/live", "Ao vivo", Radio],
  ["/wallet", "Carteira", WalletCards],
  ["/profile", "Perfil", UserRound],
] as const;

export function MobileNav() {
  const pathname = usePathname();
  return <nav className="mobile-app-nav">{links.map(([href,label,Icon]) => <Link className={pathname === href ? "active" : ""} href={href} key={href}><Icon /><span>{label}</span></Link>)}</nav>;
}
