"use client";

import { CalendarSearch, ChevronRight, Filter, Radio, Ticket, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { InnerShell } from "@/components/inner-shell";
import { Countdown } from "@/components/countdown";
import type { Draw } from "@/lib/types";
import { api } from "@/lib/api";
import { useApp } from "@/components/app-provider";

export default function DrawsPage() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [date, setDate] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [purchasedCards, setPurchasedCards] = useState<number[][][]>([]);
  const { user, openAuth } = useApp();
  useEffect(() => {
    fetch("/api/next-draws").then(async r => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setDraws(Array.isArray(data) ? data : []);
    }).catch(err => setLoadError(err instanceof Error ? err.message : "Falha ao carregar sorteios."))
      .finally(() => setLoading(false));
  }, []);
  const shown = useMemo(() => date ? draws.filter(d => d.scheduledAt.startsWith(date)) : draws, [draws, date]);
  async function buy(draw: Draw) {
    if (!user) return openAuth("login");
    const quantity = quantities[draw.id] || 1;
    setBusy(draw.id); setMessage("");
    try {
      const response = await api<unknown>(`/bingo/draws/${draw.id}/tickets`, { method: "POST", body: JSON.stringify({ quantity }) });
      setPurchasedCards(extractCards(response));
      setMessage(`${quantity} ticket(s) comprado(s) com sucesso!`);
    }
    catch (e) { setMessage(e instanceof Error ? e.message : "Falha na compra."); }
    finally { setBusy(""); }
  }
  return <InnerShell><section className="inner-hero"><p className="eyebrow"><CalendarSearch /> AGENDA DA SORTE</p><h1>Próximos <em>sorteios</em></h1><p>Escolha a melhor rodada e garanta suas cartelas.</p></section>
    <section className="search-bar panel"><Filter /><label>Pesquisar por data<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>{date && <button onClick={() => setDate("")}>Limpar filtro</button>}</section>
    {message && <div className="notice">{message}</div>}
    {loading && <div className="empty"><div className="loader" />Buscando sorteios reais...</div>}
    {loadError && <div className="empty error-state"><h2>API indisponível</h2><p>{loadError}</p></div>}
    <section className="cards-grid">{!loading && !loadError && shown.map((draw, i) => <article className="draw-card panel" key={draw.id}>
      <div className={`ball ${["blue","red","gold","purple"][i%4]}`}>{["11","30","65","90"][i%4]}</div>
      <span className="live-tag">Inscrições abertas</span><h2>{draw.room?.name || "Sala Ouro"}</h2>
      <p>{new Date(draw.scheduledAt).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })}</p>
      <div className="draw-prize-list"><span><small>1º prêmio</small><b>{money(drawPrize(draw,1))}</b></span><span><small>2º prêmio</small><b>{money(drawPrize(draw,2))}</b></span><span><small>3º prêmio</small><b>{money(drawPrize(draw,3))}</b></span></div>
      <div className="prize"><small>Total de prêmios</small><strong>{money(drawPrize(draw,1) + drawPrize(draw,2) + drawPrize(draw,3) + drawJackpot(draw))}</strong>{drawJackpot(draw) > 0 && <em>Jackpot: {money(drawJackpot(draw))}</em>}</div>
      <Countdown date={draw.scheduledAt} compact />
      <div className="quantity-picker">
        <span>Quantidade de tickets</span>
        <div className="quick-quantities">{[5,10,20,30,50].map(value => <button className={(quantities[draw.id] || 1) === value ? "active" : ""} type="button" onClick={() => setQuantities(q => ({...q,[draw.id]:value}))} key={value}>{value}</button>)}</div>
        <div>
          <button type="button" onClick={() => setQuantities(q => ({...q, [draw.id]: Math.max(1, (q[draw.id] || 1) - 1)}))} aria-label="Diminuir quantidade">−</button>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="100"
            value={quantities[draw.id] || 1}
            onChange={e => setQuantities(q => ({...q, [draw.id]: Math.min(100, Math.max(1, Number(e.target.value) || 1))}))}
            aria-label="Quantidade de tickets"
          />
          <button type="button" onClick={() => setQuantities(q => ({...q, [draw.id]: Math.min(100, (q[draw.id] || 1) + 1)}))} aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <div className="purchase-total"><span>{quantities[draw.id] || 1} × {money(Number(draw.ticketPrice || 0))}</span><strong>Total: {money((quantities[draw.id] || 1) * Number(draw.ticketPrice || 0))}</strong></div>
      <button className="btn btn-gold wide" onClick={() => buy(draw)} disabled={busy === draw.id}><Ticket />{busy === draw.id ? "Comprando..." : "Comprar tickets"}<ChevronRight /></button>
    </article>)}</section>
    {!loading && !loadError && !shown.length && <div className="empty">Nenhum sorteio futuro encontrado nesta data.</div>}
    {!!purchasedCards.length && <div className="modal-backdrop"><section className="purchase-modal panel"><button className="modal-close" onClick={() => setPurchasedCards([])}><X /></button><p className="eyebrow">COMPRA CONFIRMADA</p><h2>Suas cartelas</h2><p>Boa sorte! Acompanhe seus números ao vivo.</p><div className="purchased-grid">{purchasedCards.map((card,index) => <article className="bingo-card" key={index}><strong>CARTELA {String(index+1).padStart(2,"0")}</strong>{card.flat().map((number,i)=><span key={i}>{number || "★"}</span>)}</article>)}</div><div className="modal-actions"><button className="btn btn-ghost" onClick={() => setPurchasedCards([])}>Fechar</button><button className="btn btn-gold" onClick={() => location.assign("/live")}><Radio />Ir para o ao vivo</button></div></section></div>}
  </InnerShell>;
}

function extractCards(response: unknown): number[][][] {
  const source = response as { tickets?: unknown[]; items?: unknown[]; numbers?: unknown[] };
  const tickets = Array.isArray(response) ? response : source?.tickets || source?.items || [source];
  return tickets.flatMap((ticket: unknown) => {
    const value = ticket as { numbers?: unknown[] };
    if (!Array.isArray(value?.numbers)) return [];
    return value.numbers.flatMap(item => {
      if (Array.isArray(item) && Array.isArray(item[0])) return [item as number[][]];
      const wrapped = item as { numbers?: number[][] };
      return Array.isArray(wrapped?.numbers) ? [wrapped.numbers] : [];
    });
  });
}

function safeNumber(value: unknown) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; }
function money(value: number) { return `R$ ${safeNumber(value).toLocaleString("pt-BR",{minimumFractionDigits:2})}`; }
function drawPrize(draw: Draw, line: 1|2|3) {
  const source = draw as Draw & Record<string, unknown>;
  return safeNumber(source[`prizeLine${line}`] ?? source[`prize${line}`] ?? source[`value_prize${line}`]);
}
function drawJackpot(draw: Draw) {
  const source = draw as Draw & Record<string, unknown>;
  const jackpot = source.jackpot as { currentAmount?: unknown; baseAmount?: unknown } | undefined;
  return safeNumber(source.jackpotAmount ?? source.value_jackpot ?? jackpot?.currentAmount ?? jackpot?.baseAmount);
}
