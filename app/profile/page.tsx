"use client";

import { KeyRound, LogOut, Mail, ShieldCheck, UserRound, WalletCards } from "lucide-react";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { InnerShell } from "@/components/inner-shell";
import { useApp } from "@/components/app-provider";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user,setUser,openAuth } = useApp();
  const [message,setMessage] = useState(""); const [busy,setBusy] = useState(false);
  function logout(){localStorage.removeItem("bingo_token");localStorage.removeItem("bingo_refresh_token");localStorage.removeItem("bingo_user");setUser(null);location.assign("/")}
  async function changePassword(event: FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setMessage("");const form=new FormData(event.currentTarget);
    if(form.get("newPassword")!==form.get("confirmPassword")){setBusy(false);return setMessage("As novas senhas não coincidem.");}
    try{await api("/auth/player/change-password",{method:"POST",body:JSON.stringify({currentPassword:form.get("currentPassword"),newPassword:form.get("newPassword")})});setMessage("Senha alterada com sucesso.");event.currentTarget.reset()}
    catch(error){setMessage(error instanceof Error?error.message:"Não foi possível alterar a senha.")}finally{setBusy(false)}
  }
  return <InnerShell><section className="inner-hero compact-inner"><p className="eyebrow"><UserRound/> MINHA CONTA</p><h1>Meu <em>perfil</em></h1></section>
    {!user?<div className="empty auth-empty"><UserRound/><h2>Entre para acessar seu perfil</h2><button className="btn btn-gold" onClick={()=>openAuth("login")}>Entrar</button></div>:<section className="profile-grid">
      <article className="profile-card panel"><div className="profile-avatar">{user.display_name?.[0]||"J"}</div><h2>{user.display_name}</h2><p><Mail/> {String(user.email||"E-mail da conta")}</p><span><ShieldCheck/> Conta verificada</span><div className="profile-balance"><small>Saldo</small><strong>{user.symbol||"R$"} {Number(user.balance||0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong></div><Link className="btn btn-blue wide" href="/wallet"><WalletCards/>Abrir carteira</Link><button className="logout-profile" onClick={logout}><LogOut/>Sair da conta</button></article>
      <article className="password-card panel"><KeyRound/><h2>Alterar senha</h2><p>Use uma senha forte e diferente das demais.</p><form onSubmit={changePassword}><label>Senha atual<input name="currentPassword" type="password" required /></label><label>Nova senha<input name="newPassword" type="password" minLength={8} required /></label><label>Confirmar nova senha<input name="confirmPassword" type="password" minLength={8} required /></label>{message&&<div className="notice">{message}</div>}<button className="btn btn-gold wide" disabled={busy}>{busy?"Aguarde...":"Atualizar senha"}</button></form></article>
    </section>}
  </InnerShell>
}
