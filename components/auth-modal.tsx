"use client";

import { Eye, EyeOff, LockKeyhole, Mail, Phone, User, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api, login, saveAuth } from "@/lib/api";
import { useApp } from "./app-provider";
import type { AuthData } from "@/lib/types";

export function AuthModal() {
  const { authOpen, setAuthOpen, authMode, setUser } = useApp();
  const [mode, setMode] = useState(authMode);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => setMode(authMode), [authMode]);
  if (!authOpen) return null;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const form = new FormData(e.currentTarget);
    try {
      let data: AuthData;
      if (mode === "login") data = await login(String(form.get("email")), String(form.get("password")));
      else {
        const fromUrl = new URLSearchParams(location.search).get("affiliate")?.trim();
        const affiliate = fromUrl || localStorage.getItem("bingo_affiliate_id") || process.env.NEXT_PUBLIC_DEFAULT_AFFILIATE || "";
        if (fromUrl) localStorage.setItem("bingo_affiliate_id", fromUrl);
        data = await api<AuthData>(`/auth/player/register${affiliate ? `?affiliate=${encodeURIComponent(affiliate)}` : ""}`, {
          method: "POST",
          body: JSON.stringify({
            name: form.get("name"), email: form.get("email"), password: form.get("password"),
            phone: String(form.get("phone")).replace(/\D/g, ""), cpf: String(form.get("cpf")).replace(/\D/g, ""),
            affiliateId: affiliate
          })
        });
        saveAuth(data);
      }
      setUser(data); setAuthOpen(false);
    } catch (err) { setError(err instanceof Error ? err.message : "Tente novamente."); }
    finally { setBusy(false); }
  }

  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setAuthOpen(false)}>
      <section className="auth-modal">
        <button className="modal-close" onClick={() => setAuthOpen(false)}><X /></button>
        <div className="mini-ball">11</div>
        <p className="eyebrow">{mode === "login" ? "BEM-VINDO DE VOLTA" : "VENHA SER UM CAMPEÃO"}</p>
        <h2>{mode === "login" ? "Entre para jogar" : "Crie sua conta"}</h2>
        <p className="muted">{mode === "login" ? "A sorte está esperando por você." : "É rápido, seguro e você já pode jogar."}</p>
        <form onSubmit={submit}>
          {mode === "register" && <>
            <label><User /><input name="name" placeholder="Nome completo" required /></label>
            <div className="form-row"><label><Phone /><input name="phone" placeholder="Telefone" required /></label><label><User /><input name="cpf" placeholder="CPF" required /></label></div>
          </>}
          <label><Mail /><input name="email" type="email" placeholder="Seu e-mail" required /></label>
          <label><LockKeyhole /><input name="password" type={show ? "text" : "password"} placeholder="Sua senha" minLength={8} required /><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff /> : <Eye />}</button></label>
          {error && <p className="form-error">{error}</p>}
          <button className="btn btn-gold wide" disabled={busy}>{busy ? "Aguarde..." : mode === "login" ? "ENTRAR" : "CRIAR MINHA CONTA"}</button>
        </form>
        <button className="switch-mode" onClick={() => { setError(""); setMode(mode === "login" ? "register" : "login"); }}>
          {mode === "login" ? "Ainda não tem conta? Cadastre-se" : "Já tem uma conta? Entrar"}
        </button>
      </section>
    </div>
  );
}
