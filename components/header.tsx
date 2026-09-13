"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Gift,
  Headphones,
  Home,
  LogOut,
  Menu,
  Radio,
  Ticket,
  UserRound,
  Volume2,
  VolumeX,
  X,
  Trophy,
  WalletCards,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "./logo";
import { useApp } from "./app-provider";
import { ThemeSwitcher } from "./theme-switcher";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
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
    if (!menuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".nav-container") && !target.closest(".mobile-menu-drawer")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [menuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        {/* Brand Logo */}
        <div className="header-logo-col">
          <Logo />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="header-desktop-nav" aria-label="Navegação principal">
          <Link
            href="/"
            className={`nav-link ${pathname === "/" ? "active" : ""}`}
          >
            <span>Início</span>
            {pathname === "/" && <span className="active-pill" />}
          </Link>
          <Link
            href="/draws"
            className={`nav-link ${pathname === "/draws" ? "active" : ""}`}
          >
            <span>Sorteios</span>
            {pathname === "/draws" && <span className="active-pill" />}
          </Link>
          <a href="#promocoes" className="nav-link">
            <span>Promoções</span>
          </a>
          <a href="#ganhadores" className="nav-link">
            <span>Ganhadores</span>
          </a>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions-col">
          {isLive && (
            <>
              <LiveClock />
              <button
                className="sound-toggle-btn-compact"
                onClick={() => setMuted(!muted)}
                aria-label={muted ? "Ativar som" : "Desativar som"}
                title="Alternar áudio da Live"
              >
                {muted ? <VolumeX /> : <Volume2 />}
              </button>
            </>
          )}

          {user ? (
            <div className="header-user-group">
              <Link href="/profile" className="header-user-chip" title="Meu perfil">
                <UserRound className="user-icon" />
                <span className="user-meta">
                  <span className="user-name">
                    Olá, <b>{user.display_name?.split(" ")[0] || "Jogador"}</b>
                  </span>
                  <span className="user-balance">
                    {user.symbol || "R$"} {Number(user.balance || 0).toFixed(2)}
                  </span>
                </span>
              </Link>
              <button
                type="button"
                className="btn-header-logout"
                onClick={logout}
                aria-label="Sair da conta"
                title="Sair"
              >
                <LogOut className="logout-icon" />
              </button>
            </div>
          ) : (
            <div className="header-auth-buttons">
              <button
                type="button"
                className="btn-header-login"
                onClick={() => openAuth("login")}
              >
                Entrar
              </button>
              <button
                type="button"
                className="btn-header-register"
                onClick={() => openAuth("register")}
              >
                Criar conta
              </button>
            </div>
          )}

          {/* Theme Switcher */}
          <ThemeSwitcher compact={true} />

          {/* Mobile Hamburger Button */}
          <div className="nav-container">
            <button
              type="button"
              className={`hamburger-btn ${menuOpen ? "active" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>

            {menuOpen && (
              <div className="mobile-menu-drawer" role="menu">
                <div className="drawer-header">
                  <span className="drawer-title">Menu</span>
                  <button
                    type="button"
                    className="drawer-close-btn"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Fechar"
                  >
                    <X />
                  </button>
                </div>

                <nav className="drawer-nav">
                  <Link href="/" onClick={() => setMenuOpen(false)}>
                    <Home className="nav-icon" />
                    <span>Início</span>
                  </Link>
                  <Link href="/draws" onClick={() => setMenuOpen(false)}>
                    <CalendarDays className="nav-icon" />
                    <span>Sorteios</span>
                  </Link>
                  <Link href="/live" onClick={() => setMenuOpen(false)}>
                    <Radio className="nav-icon" />
                    <span>Sorteio Ao vivo</span>
                  </Link>
                  <Link href="/tickets" onClick={() => setMenuOpen(false)}>
                    <Ticket className="nav-icon" />
                    <span>Meus tickets</span>
                  </Link>
                  <Link href="/wallet" onClick={() => setMenuOpen(false)}>
                    <WalletCards className="nav-icon" />
                    <span>Minha Carteira</span>
                  </Link>
                  <a href="#promocoes" onClick={() => setMenuOpen(false)}>
                    <Gift className="nav-icon" />
                    <span>Promoções</span>
                  </a>
                  <a href="#ganhadores" onClick={() => setMenuOpen(false)}>
                    <Trophy className="nav-icon" />
                    <span>Ganhadores</span>
                  </a>
                  <a href="#contato" onClick={() => setMenuOpen(false)}>
                    <Headphones className="nav-icon" />
                    <span>Contato</span>
                  </a>
                </nav>

                <div className="drawer-footer">
                  <div className="drawer-theme-row">
                    <span>Tema visual</span>
                    <ThemeSwitcher compact={false} />
                  </div>
                  {!user && (
                    <div className="drawer-auth-buttons">
                      <button
                        type="button"
                        className="btn-drawer-login"
                        onClick={() => {
                          setMenuOpen(false);
                          openAuth("login");
                        }}
                      >
                        Entrar
                      </button>
                      <button
                        type="button"
                        className="btn-drawer-register"
                        onClick={() => {
                          setMenuOpen(false);
                          openAuth("register");
                        }}
                      >
                        Criar conta
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
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
      <span className="clock-date">
        {clock ? clock.toLocaleDateString("pt-BR") : "06/08/2026"}
      </span>
      <span className="clock-sep">|</span>
      <span className="clock-time">
        {clock ? clock.toLocaleTimeString("pt-BR") : "09:39:32"}
      </span>
    </div>
  );
}
