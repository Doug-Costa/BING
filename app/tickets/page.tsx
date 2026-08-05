"use client";

import { ChevronLeft, ChevronRight, Search, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { InnerShell } from "@/components/inner-shell";
import { api } from "@/lib/api";
import { useApp } from "@/components/app-provider";

type TicketItem = { id: string; incrementalId: number; createdAt: string; totalValue: number; status: string; room?: { name: string }; draw?: { scheduledAt: string }; numbers?: { numbers: number[][] }[] };

export default function TicketsPage() {
  const { user, openAuth } = useApp();
  const [items, setItems] = useState<TicketItem[]>([]);
  const [page, setPage] = useState(1); const [total, setTotal] = useState(0); const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [startDate, setStart] = useState(""); const [endDate, setEnd] = useState("");
  async function load() {
    if (!user) return;
    setLoading(true); setLoadError("");
    const q = new URLSearchParams({ page: String(page), limit: "10" });
    if (startDate) q.set("startDate", new Date(`${startDate}T00:00:00`).toISOString());
    if (endDate) q.set("endDate", new Date(`${endDate}T23:59:59`).toISOString());
    try {
      const data = await api<{items: TicketItem[]; total: number}>(`/bingo/draws/my-tickets-pos?${q}`);
      setItems(data.items);
      setTotal(data.total);
    } catch (error) {
      setItems([]);
      setLoadError(error instanceof Error ? error.message : "Não foi possível carregar os tickets.");
    }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [user, page]);
  return <InnerShell><section className="inner-hero compact-inner"><p className="eyebrow"><Ticket /> SUA ÁREA</p><h1>Meus <em>tickets</em></h1></section>
    {!user ? <section className="empty auth-empty"><Ticket /><h2>Entre para ver seus tickets</h2><p>Acompanhe suas cartelas, sorteios e premiações.</p><button className="btn btn-gold" onClick={() => openAuth("login")}>Entrar agora</button></section> : <>
      <section className="search-bar panel ticket-filter"><label>De<input type="date" value={startDate} onChange={e=>setStart(e.target.value)} /></label><label>Até<input type="date" value={endDate} onChange={e=>setEnd(e.target.value)} /></label><button className="btn btn-blue" onClick={load}><Search />Pesquisar</button></section>
      {loadError && <div className="notice ticket-error">{loadError}</div>}
      <section className="ticket-list panel">{loading ? <div className="loader" /> : items.length ? items.map(item => <article className="ticket-item" key={item.id}><div><small>Ticket</small><b>#{item.incrementalId}</b></div><div><small>Sala</small><b>{item.room?.name || "Bingo Show"}</b></div><div><small>Sorteio</small><b>{item.draw ? new Date(item.draw.scheduledAt).toLocaleString("pt-BR") : "—"}</b></div><div><small>Valor</small><b>R$ {Number(item.totalValue).toFixed(2)}</b></div><span className="status">{item.status}</span></article>) : <div className="empty"><Ticket /><h2>Nenhum ticket encontrado</h2><p>Quando você comprar, suas cartelas aparecerão aqui.</p></div>}</section>
      <div className="pagination"><button disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft /></button><span>Página {page} de {Math.max(1,Math.ceil(total/10))}</span><button disabled={page*10>=total} onClick={()=>setPage(p=>p+1)}><ChevronRight /></button></div>
    </>}
  </InnerShell>;
}
