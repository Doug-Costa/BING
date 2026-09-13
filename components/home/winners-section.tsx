"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Crown, User, Sparkles, Zap, CheckCircle2 } from "lucide-react";

export interface WinnerDisplay {
  id: string;
  name: string;
  type: "1ª Linha" | "2ª Linha" | "Bingo (3L)";
  amount: string;
  time: string;
}

const DEFAULT_WINNERS: WinnerDisplay[] = [
  {
    id: "w1",
    name: "Flávia G.",
    type: "1ª Linha",
    amount: "R$ 500,00",
    time: "Hoje às 15:42",
  },
  {
    id: "w2",
    name: "Carlos A.",
    type: "Bingo (3L)",
    amount: "R$ 5.000,00",
    time: "Hoje às 13:18",
  },
  {
    id: "w3",
    name: "Marcos S.",
    type: "2ª Linha",
    amount: "R$ 1.500,00",
    time: "Hoje às 11:05",
  },
  {
    id: "w4",
    name: "Rafael C.",
    type: "Bingo (3L)",
    amount: "R$ 4.200,00",
    time: "Hoje às 09:30",
  },
  {
    id: "w5",
    name: "Juliana M.",
    type: "1ª Linha",
    amount: "R$ 250,00",
    time: "Ontem às 22:15",
  },
  {
    id: "w6",
    name: "Alberto S.",
    type: "2ª Linha",
    amount: "R$ 750,00",
    time: "Ontem às 20:00",
  },
];

export function WinnersSection() {
  const [winners] = useState<WinnerDisplay[]>(DEFAULT_WINNERS);

  return (
    <section className="home-section winners-section" id="ganhadores" aria-labelledby="winners-heading">
      <div className="section-header">
        <div className="section-title-group">
          <span className="section-badge-pill">
            <Zap className="badge-flame-icon" /> PAGAMENTOS NO PIX
          </span>
          <h2 id="winners-heading" className="section-title">
            Últimos ganhadores
          </h2>
        </div>
        <Link href="/draws" className="section-link">
          <span>Ver todos os ganhadores</span>
          <ArrowRight className="link-arrow" />
        </Link>
      </div>

      <div className="winners-cards-container">
        {winners.map((winner) => {
          const isBingo = winner.type === "Bingo (3L)";
          const isLine2 = winner.type === "2ª Linha";
          const badgeClass = isBingo ? "badge-bingo" : isLine2 ? "badge-linha2" : "badge-linha";
          return (
            <div key={winner.id} className="winner-pill-card">
              <div className="winner-avatar">
                <User className="avatar-icon" />
              </div>

              <div className="winner-details">
                <div className="winner-top-row">
                  <span className="winner-name">{winner.name}</span>
                  <span className={`winner-badge ${badgeClass}`}>
                    <Crown className="crown-icon" />
                    <span>{winner.type}</span>
                  </span>
                </div>
                <div className="winner-bottom-row">
                  <strong className="winner-amount">{winner.amount}</strong>
                  <div className="winner-pix-verified">
                    <CheckCircle2 className="pix-check-icon" />
                    <span>Pago via PIX</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

