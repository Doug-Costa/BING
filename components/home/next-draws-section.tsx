"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Sun, Moon, Sparkles, RefreshCw, Trophy, Flame, Zap, Clock } from "lucide-react";
import type { Draw } from "@/lib/types";

interface DrawCardTheme {
  id: string;
  themeClass: string;
  ballNumber: string;
  ballColor: string;
  icon: "sun" | "moon";
  defaultTitle: string;
  defaultPrize: string;
  prizeLine1: string;
  prizeLine2: string;
  prizeLine3: string;
  ticketPrice: string;
  defaultTime: string;
}

const FEATURED_ROUNDS: DrawCardTheme[] = [
  {
    id: "round-manha",
    themeClass: "card-theme-blue",
    ballNumber: "15",
    ballColor: "blue",
    icon: "sun",
    defaultTitle: "Sorteio da Manhã",
    defaultPrize: "R$ 5.000,00",
    prizeLine1: "R$ 500,00",
    prizeLine2: "R$ 1.500,00",
    prizeLine3: "R$ 3.000,00",
    ticketPrice: "R$ 1,00",
    defaultTime: "Rodada Ativa",
  },
  {
    id: "round-tarde",
    themeClass: "card-theme-coral",
    ballNumber: "45",
    ballColor: "coral",
    icon: "sun",
    defaultTitle: "Sorteio da Tarde",
    defaultPrize: "R$ 2.500,00",
    prizeLine1: "R$ 250,00",
    prizeLine2: "R$ 750,00",
    prizeLine3: "R$ 1.500,00",
    ticketPrice: "R$ 2,50",
    defaultTime: "Hoje às 15:00",
  },
  {
    id: "round-noite",
    themeClass: "card-theme-purple",
    ballNumber: "90",
    ballColor: "purple",
    icon: "moon",
    defaultTitle: "Super Noite + Jackpot",
    defaultPrize: "R$ 10.000,00",
    prizeLine1: "R$ 1.000,00",
    prizeLine2: "R$ 3.000,00",
    prizeLine3: "R$ 6.000,00",
    ticketPrice: "R$ 5,00",
    defaultTime: "Hoje às 21:00",
  },
];

export function NextDrawsSection() {
  const [draws, setDraws] = useState<Draw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDraws = () => {
    setLoading(true);
    setError("");
    fetch("/api/next-draws")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || "Falha ao carregar sorteios.");
        setDraws(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError("");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDraws();
  }, []);

  const displayList = draws.length > 0 ? draws.slice(0, 3) : null;

  return (
    <section className="home-section next-draws-section" id="sorteios" aria-labelledby="next-draws-heading">
      <div className="section-header">
        <div className="section-title-group">
          <span className="section-badge-pill">
            <Flame className="badge-flame-icon" /> BINGO LINHA • 90 BOLAS • 3x5
          </span>
          <h2 id="next-draws-heading" className="section-title">
            Próximos sorteios abertos
          </h2>
        </div>
        <Link href="/draws" className="section-link">
          <span>Ver todas as rodadas</span>
          <ArrowRight className="link-arrow" />
        </Link>
      </div>

      {loading && (
        <div className="draws-cards-grid skeleton-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="draw-card skeleton-card">
              <div className="skeleton-ball shimmer" />
              <div className="skeleton-info">
                <div className="skeleton-line shimmer title" />
                <div className="skeleton-line shimmer subtitle" />
                <div className="skeleton-btn shimmer" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && displayList && (
        <div className="draws-cards-grid">
          {displayList.map((draw, index) => {
            const theme = FEATURED_ROUNDS[index % FEATURED_ROUNDS.length];
            const title = draw.room?.name || theme.defaultTitle;
            const formattedDate = formatScheduledDate(draw.scheduledAt);
            const totalPrize = calculateTotalPrize(draw);
            const ticketPrice = (draw as any).ticketPrice ? formatMoney((draw as any).ticketPrice) : theme.ticketPrice;
            
            const p1 = Number((draw as any).prizeLine1 || 0);
            const p2 = Number((draw as any).prizeLine2 || 0);
            const p3 = Number((draw as any).prizeLine3 || 0);

            return (
              <article key={draw.id} className={`draw-card ${theme.themeClass}`}>
                {/* Left Side: 3D Ball Asset with 90-ball range */}
                <div className="draw-card-media">
                  <div className={`bingo-ball-3d ball-${theme.ballColor}`}>
                    <span>{theme.ballNumber}</span>
                  </div>
                  <span className="ball-caption-tag">Globo 90</span>
                </div>

                {/* Right Side: Content & Actions */}
                <div className="draw-card-content">
                  <div className="draw-card-header">
                    <div>
                      <h3 className="draw-card-title">{title}</h3>
                      <span className="draw-format-pill">Cartela 3x5 (15 nºs)</span>
                    </div>
                    {theme.icon === "sun" ? (
                      <Sun className="weather-icon icon-sun" />
                    ) : (
                      <Moon className="weather-icon icon-moon" />
                    )}
                  </div>

                  <div className="draw-card-prize-highlight">
                    <Trophy className="prize-trophy-icon" />
                    <div className="prize-info">
                      <small>Prêmio Estimado da Rodada</small>
                      <strong className="prize-value-glow">{totalPrize > 0 ? formatMoney(totalPrize) : theme.defaultPrize}</strong>
                    </div>
                  </div>

                  {/* 3 Prêmios Breakdown: 1 Linha, 2 Linhas, 3 Linhas (Bingo) */}
                  <div className="draw-prizes-breakdown">
                    <div className="prize-tier-item">
                      <span className="tier-label">1ª Linha</span>
                      <strong className="tier-val">{p1 > 0 ? formatMoney(p1) : theme.prizeLine1}</strong>
                    </div>
                    <div className="prize-tier-item">
                      <span className="tier-label">2ª Linha</span>
                      <strong className="tier-val">{p2 > 0 ? formatMoney(p2) : theme.prizeLine2}</strong>
                    </div>
                    <div className="prize-tier-item tier-bingo">
                      <span className="tier-label">Bingo (3L)</span>
                      <strong className="tier-val">{p3 > 0 ? formatMoney(p3) : theme.prizeLine3}</strong>
                    </div>
                  </div>

                  <div className="draw-card-meta-row">
                    <div className="draw-card-schedule">
                      <Clock className="schedule-icon" />
                      <span>{formattedDate}</span>
                    </div>
                    <span className="ticket-price-pill">Cartela: {ticketPrice}</span>
                  </div>

                  <div className="draw-card-action">
                    <Link
                      href={`/draws?select=${draw.id}`}
                      className="btn-card-buy"
                      id={`buy-draw-${draw.id}`}
                    >
                      <span>Apostar nesta rodada</span>
                      <ArrowRight className="btn-icon" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && !displayList && (
        <div className="draws-cards-grid">
          {FEATURED_ROUNDS.map((round) => (
            <article key={round.id} className={`draw-card ${round.themeClass}`}>
              {/* Left Side: 3D Ball Asset */}
              <div className="draw-card-media">
                <div className={`bingo-ball-3d ball-${round.ballColor}`}>
                  <span>{round.ballNumber}</span>
                </div>
                <span className="ball-caption-tag">Globo 90</span>
              </div>

              {/* Right Side: Content & Actions */}
              <div className="draw-card-content">
                <div className="draw-card-header">
                  <div>
                    <h3 className="draw-card-title">{round.defaultTitle}</h3>
                    <span className="draw-format-pill">Cartela 3x5 (15 nºs)</span>
                  </div>
                  {round.icon === "sun" ? (
                    <Sun className="weather-icon icon-sun" />
                  ) : (
                    <Moon className="weather-icon icon-moon" />
                  )}
                </div>

                <div className="draw-card-prize-highlight">
                  <Trophy className="prize-trophy-icon" />
                  <div className="prize-info">
                    <small>Prêmio Estimado da Rodada</small>
                    <strong className="prize-value-glow">{round.defaultPrize}</strong>
                  </div>
                </div>

                {/* 3 Prêmios Breakdown: 1 Linha, 2 Linhas, 3 Linhas (Bingo) */}
                <div className="draw-prizes-breakdown">
                  <div className="prize-tier-item">
                    <span className="tier-label">1ª Linha</span>
                    <strong className="tier-val">{round.prizeLine1}</strong>
                  </div>
                  <div className="prize-tier-item">
                    <span className="tier-label">2ª Linha</span>
                    <strong className="tier-val">{round.prizeLine2}</strong>
                  </div>
                  <div className="prize-tier-item tier-bingo">
                    <span className="tier-label">Bingo (3L)</span>
                    <strong className="tier-val">{round.prizeLine3}</strong>
                  </div>
                </div>

                <div className="draw-card-meta-row">
                  <div className="draw-card-schedule">
                    <Clock className="schedule-icon" />
                    <span>{round.defaultTime}</span>
                  </div>
                  <span className="ticket-price-pill">Cartela: {round.ticketPrice}</span>
                </div>

                <div className="draw-card-action">
                  <Link
                    href="/draws"
                    className="btn-card-buy"
                    id={`buy-round-${round.id}`}
                  >
                    <span>Apostar nesta rodada</span>
                    <ArrowRight className="btn-icon" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function calculateTotalPrize(draw: Draw): number {
  const d = draw as any;
  const p1 = Number(d.prizeLine1 || d.prize1 || 0);
  const p2 = Number(d.prizeLine2 || d.prize2 || 0);
  const p3 = Number(d.prizeLine3 || d.prize3 || 0);
  const jk = Number(d.jackpotAmount || d.jackpot?.currentAmount || 0);
  return p1 + p2 + p3 + jk;
}

function formatMoney(value: number): string {
  return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatScheduledDate(scheduledAt: string) {
  try {
    const date = new Date(scheduledAt);
    if (isNaN(date.getTime())) return "Em breve";
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const timeStr = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `Hoje às ${timeStr}`;
    }
    return date.toLocaleString("pt-BR", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Em breve";
  }
}


