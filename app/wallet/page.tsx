"use client";

import { ArrowDownToLine, ArrowUpFromLine, Clock3, WalletCards } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { InnerShell } from "@/components/inner-shell";
import { useApp } from "@/components/app-provider";

type Transaction = { id: string; type: "deposit"|"withdraw"; amount: number; date: string; status: "DEMONSTRAÇÃO" };

export default function WalletPage() {
  const { user, openAuth } = useApp();
  const [transactions,setTransactions] = useState<Transaction[]>([]);
  const [mode,setMode] = useState<"deposit"|"withdraw">("deposit");
  const [notice,setNotice] = useState("");
  useEffect(() => { try { setTransactions(JSON.parse(localStorage.getItem("bingo_demo_wallet") || "[]")); } catch {} },[]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(new FormData(event.currentTarget).get("amount"));
    if (!Number.isFinite(amount) || amount <= 0) return setNotice("Informe um valor válido.");
    const item: Transaction = { id: crypto.randomUUID(), type: mode, amount, date: new Date().toISOString(), status: "DEMONSTRAÇÃO" };
    const next = [item,...transactions]; setTransactions(next); localStorage.setItem("bingo_demo_wallet",JSON.stringify(next));
    setNotice(`${mode === "deposit" ? "Depósito" : "Retirada"} demonstrativo registrado. Nenhum dinheiro foi movimentado.`);
    event.currentTarget.reset();
  }
  return <InnerShell><section className="inner-hero compact-inner"><p className="eyebrow"><WalletCards /> MINHA CONTA</p><h1>Minha <em>carteira</em></h1></section>
    {!user ? <div className="empty auth-empty"><WalletCards/><h2>Entre para acessar a carteira</h2><button className="btn btn-gold" onClick={()=>openAuth("login")}>Entrar</button></div> : <>
      <div className="demo-warning">AMBIENTE DEMONSTRATIVO — depósitos e retiradas abaixo não movimentam dinheiro real.</div>
      <section className="wallet-grid"><article className="wallet-balance panel"><small>Saldo disponível</small><strong>{user.symbol || "R$"} {Number(user.balance || 0).toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong><span>Conta de {user.display_name}</span></article>
      <article className="wallet-action panel"><div className="wallet-tabs"><button className={mode==="deposit"?"active":""} onClick={()=>setMode("deposit")}><ArrowDownToLine/>Depositar</button><button className={mode==="withdraw"?"active":""} onClick={()=>setMode("withdraw")}><ArrowUpFromLine/>Retirar</button></div><form onSubmit={submit}><label>Valor demonstrativo<div><span>R$</span><input name="amount" type="number" min=".01" step=".01" placeholder="0,00" required /></div></label><div className="amount-pills">{[10,20,50,100,200].map(value=><button type="button" onClick={e=>{const form=e.currentTarget.closest("form");const input=form?.elements.namedItem("amount") as HTMLInputElement;if(input)input.value=String(value)}} key={value}>R$ {value}</button>)}</div><button className="btn btn-gold wide">{mode==="deposit"?"Simular depósito":"Simular retirada"}</button></form></article></section>
      {notice && <div className="notice">{notice}</div>}
      <section className="panel wallet-history"><div className="panel-title"><h2><Clock3/>Histórico demonstrativo</h2></div>{transactions.length?transactions.map(item=><article key={item.id}><span className={item.type}><i>{item.type==="deposit"?<ArrowDownToLine/>:<ArrowUpFromLine/>}</i><b>{item.type==="deposit"?"Depósito":"Retirada"}</b></span><time>{new Date(item.date).toLocaleString("pt-BR")}</time><strong>{item.type==="deposit"?"+":"−"} R$ {item.amount.toLocaleString("pt-BR",{minimumFractionDigits:2})}</strong><small>{item.status}</small></article>):<div className="empty">Nenhuma movimentação demonstrativa.</div>}</section>
    </>}
  </InnerShell>;
}
