"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Gift, Headphones, Home, LogOut, Menu, Radio, Ticket, UserRound, Volume2, VolumeX, X, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "./logo";
import { useApp } from "./app-provider";

export function Header() {
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const { user, setUser, openAuth, muted, setMuted } = useApp();
  const isLive = pathname === "/live";

  const logout = () => { 
    localStorage.removeItem("bingo_token"); 
    localStorage.removeItem("bingo_refresh_token"); 
    localStorage.removeItem("bingo_user"); 
    setUser(null); 
  };

  useEffect(() => {
    if (!menu) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".nav-container")) {
        setMenu(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menu]);

  return (
    <header className="header">
      <Logo />
      <div className="nav-container">
        <button 
          className={`gear-button ${menu ? "active" : ""}`} 
          onClick={() => setMenu(!menu)} 
          aria-label="Menu de navegação"
        >
          <Settings />
        </button>
        {menu && (
          <nav className="nav-dropdown" onClick={() => setMenu(false)}>
            <Link href="/"><Home />Início</Link>
            <Link href="/draws"><CalendarDays />Sorteios</Link>
            <Link href="/tickets"><Ticket />Meus tickets</Link>
            <Link href="/live"><Radio />Ao vivo</Link>
            <a href="#promocoes"><Gift />Promoções</a>
            <a href="#contato"><Headphones />Contato</a>
          </nav>
        )}
      </div>
      <div className="account">
        {isLive && (
          <>
            <LiveClock />
            <button className="sound-toggle-btn-compact" onClick={() => setMuted(!muted)} aria-label="Som">
              {muted ? <VolumeX /> : <Volume2 />}
            </button>
          </>
        )}
        {user ? (
          <>
            <Link href="/profile" className="user-chip">
              <UserRound />
              <span>
                Olá, <b>{user.display_name?.split(" ")[0] || "Jogador"}</b>
                <small>{user.symbol || "R$"} {Number(user.balance).toFixed(2)}</small>
              </span>
            </Link>
            <button className="icon-button" onClick={logout} aria-label="Sair">
              <LogOut />
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost compact" onClick={() => openAuth("login")}>Entrar</button>
            <button className="btn btn-gold compact" onClick={() => openAuth("register")}>Cadastre-se</button>
          </>
        )}
      </div>
    </header>
  );
}

function LiveClock() {
  const [clock, setClock] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setClock(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="live-clock-pill">
      <CalendarDays className="clock-cal-icon" />
      <span className="clock-date">{clock ? clock.toLocaleDateString("pt-BR") : "06/08/2026"}</span>
      <span className="clock-sep">|</span>
      <span className="clock-time">{clock ? clock.toLocaleTimeString("pt-BR") : "09:39:32"}</span>
    </div>
  );
}
