"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Draw } from "@/lib/types";
import { Countdown } from "./countdown";

const colors = ["purple", "red", "gold"];
const nums = ["90", "30", "65"];

export function DrawList({ limit = 3 }: { limit?: number }) {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/next-draws")
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message);
        setDraws(Array.isArray(data) ? data : []);
      })
      .catch(err => setError(err instanceof Error ? err.message : "Falha ao carregar sorteios."))
      .finally(() => setLoading(false));
  }, []);
  return (
    <section className="panel draws-panel">
      <div className="panel-title"><h2><CalendarDays />Próximos sorteios</h2><Link href="/draws">Ver todos <ChevronRight /></Link></div>
      <div className="draw-rows">
        {loading && <div className="draw-feedback"><div className="loader" /><span>Buscando sorteios...</span></div>}
        {!loading && error && <div className="draw-feedback error-state"><strong>API indisponível</strong><span>{error}</span></div>}
        {!loading && !error && !draws.length && <div className="draw-feedback"><strong>Nenhum sorteio disponível</strong><span>Novas rodadas aparecerão aqui.</span></div>}
        {draws.slice(0, limit).map((draw, i) => (
          <article className="draw-row" key={draw.id}>
            <div className={`ball ${colors[i % 3]}`}>{nums[i % 3]}</div>
            <div className="draw-copy">
              <h3>{draw.room?.name || `Sorteio #${draw.id.slice(0, 5)}`}</h3>
              <div className="mini-prizes"><span>1ª <b>{money(prize(draw,1))}</b></span><span>2ª <b>{money(prize(draw,2))}</b></span><span>3ª <b>{money(prize(draw,3))}</b></span></div>
              <strong>Total {money(prize(draw,1) + prize(draw,2) + prize(draw,3) + drawJackpot(draw))}</strong>
              {drawJackpot(draw) > 0 && <em>+ Jackpot {money(drawJackpot(draw))}</em>}
              <small>{new Date(draw.scheduledAt).toLocaleString("pt-BR", { weekday: "short", hour: "2-digit", minute: "2-digit" })}</small>
            </div>
            <Countdown date={draw.scheduledAt} />
            <Link className="row-action" href={`/draws?select=${draw.id}`} aria-label="Ver sorteio"><ChevronRight /></Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function money(value: number) {
  return `R$ ${safeNumber(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
}

function safeNumber(value: unknown) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; }
function prize(draw: Draw, line: 1|2|3) {
  const source = draw as Draw & Record<string, unknown>;
  return safeNumber(source[`prizeLine${line}`] ?? source[`prize${line}`] ?? source[`value_prize${line}`]);
}
function drawJackpot(draw: Draw) {
  const source = draw as Draw & Record<string, unknown>;
  const jackpot = source.jackpot as { currentAmount?: unknown; baseAmount?: unknown } | undefined;
  return safeNumber(source.jackpotAmount ?? source.value_jackpot ?? jackpot?.currentAmount ?? jackpot?.baseAmount);
}
