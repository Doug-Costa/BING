"use client";

import Link from "next/link";
import { CalendarDays, Gift, Headphones, Home, LogOut, Menu, Radio, Ticket, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { useApp } from "./app-provider";

export function Header() {
  const [menu, setMenu] = useState(false);
  const { user, setUser, openAuth } = useApp();
  const logout = () => { localStorage.removeItem("bingo_token"); localStorage.removeItem("bingo_refresh_token"); localStorage.removeItem("bingo_user"); setUser(null); };
  return (
    <header className="header">
      <Logo />
      <button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Abrir menu">{menu ? <X /> : <Menu />}</button>
      <nav className={menu ? "nav open" : "nav"} onClick={() => setMenu(false)}>
        <Link href="/"><Home />Início</Link>
        <Link href="/draws"><CalendarDays />Sorteios</Link>
        <Link href="/tickets"><Ticket />Meus tickets</Link>
        <Link href="/live"><Radio />Ao vivo</Link>
        <a href="#promocoes"><Gift />Promoções</a>
        <a href="#contato"><Headphones />Contato</a>
      </nav>
      <div className="account">
        {user ? <>
          <Link href="/profile" className="user-chip"><UserRound /><span>Olá, <b>{user.display_name?.split(" ")[0] || "Jogador"}</b><small>{user.symbol || "R$"} {Number(user.balance).toFixed(2)}</small></span></Link>
          <button className="icon-button" onClick={logout} aria-label="Sair"><LogOut /></button>
        </> : <>
          <button className="btn btn-ghost" onClick={() => openAuth("login")}>Entrar</button>
          <button className="btn btn-gold compact" onClick={() => openAuth("register")}>Cadastre-se</button>
        </>}
      </div>
    </header>
  );
}
