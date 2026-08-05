"use client";

import { ShoppingCart, Ticket, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Draw } from "@/lib/types";
import { Countdown } from "./countdown";
import { api } from "@/lib/api";
import { useApp } from "./app-provider";

export function LiveNextDraw() {
  const [draws,setDraws] = useState<Draw[]>([]);
  const [open,setOpen] = useState(false);
  const [now,setNow] = useState(Date.now());
  useEffect(()=>{
    const load=()=>fetch("/api/next-draws",{cache:"no-store"}).then(r=>r.json()).then(data=>Array.isArray(data)&&setDraws(data)).catch(()=>{});
    load();
    const refresh=setInterval(load,15000);
    const clock=setInterval(()=>setNow(Date.now()),5000);
    return()=>{clearInterval(refresh);clearInterval(clock)}
  },[]);
  const futureDraws=draws.filter(draw=>new Date(draw.scheduledAt).getTime()>now).sort((a,b)=>new Date(a.scheduledAt).getTime()-new Date(b.scheduledAt).getTime());
  const next=futureDraws[0];
  if(!next)return null;
  return <><button className="next-draw-trigger" onClick={()=>setOpen(true)}><ShoppingCart/><div className="next-draw-copy"><em>Comprar ticket</em><span><b>{new Date(next.scheduledAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</b></span></div><div className="next-draw-timer"><small>PRÓXIMO EM</small><Countdown date={next.scheduledAt} compact/></div></button>{open&&<LiveBuyModal draws={futureDraws} onClose={()=>setOpen(false)}/>}</>;
}

function LiveBuyModal({draws,onClose}:{draws:Draw[];onClose:()=>void}){
  const {user,openAuth}=useApp();const [quantities,setQuantities]=useState<Record<string,number>>({});const [busy,setBusy]=useState("");const [message,setMessage]=useState("");
  async function buy(draw:Draw){if(!user){onClose();return openAuth("login")}const quantity=quantities[draw.id]||5;setBusy(draw.id);setMessage("");try{await api(`/bingo/draws/${draw.id}/tickets`,{method:"POST",body:JSON.stringify({quantity})});setMessage(`${quantity} cartelas compradas para ${new Date(draw.scheduledAt).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}.`)}catch(error){setMessage(error instanceof Error?error.message:"Falha na compra.")}finally{setBusy("")}}
  return <div className="modal-backdrop live-buy-backdrop"><section className="live-buy-modal panel"><button className="modal-close" onClick={onClose}><X/></button><p className="eyebrow"><ShoppingCart/> COMPRE SEM SAIR DO AO VIVO</p><h2>Próximos sorteios</h2>{message&&<div className="notice">{message}</div>}<div className="live-buy-list">{draws.map(draw=><article key={draw.id}><div><small>{draw.room?.name||"Bingo Show"}</small><b>{new Date(draw.scheduledAt).toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"})}</b><strong>{money(Number(draw.prizeLine1||0)+Number(draw.prizeLine2||0)+Number(draw.prizeLine3||0))}</strong></div><Countdown date={draw.scheduledAt} compact/><div className="live-quantity">{[5,10,20,30,50].map(value=><button className={(quantities[draw.id]||5)===value?"active":""} onClick={()=>setQuantities(q=>({...q,[draw.id]:value}))} key={value}>{value}</button>)}</div><span className="live-buy-total">{quantities[draw.id]||5} × {money(Number(draw.ticketPrice||0))}<b>{money((quantities[draw.id]||5)*Number(draw.ticketPrice||0))}</b></span><button className="btn btn-gold" disabled={busy===draw.id} onClick={()=>buy(draw)}><Ticket/>{busy===draw.id?"Comprando...":"Comprar"}</button></article>)}</div></section></div>
}
function money(value:number){return `R$ ${Number.isFinite(value)?value.toLocaleString("pt-BR",{minimumFractionDigits:2}):"0,00"}`}
