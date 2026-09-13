"use client";

import React from "react";
import { Ticket, Radio, Zap, CheckCircle2, ShieldCheck, ArrowRight, HelpCircle, Trophy, Grid3X3, Layers } from "lucide-react";

interface HowToPlaySectionProps {
  onBuyTickets: () => void;
}

export function HowToPlaySection({ onBuyTickets }: HowToPlaySectionProps) {
  const steps = [
    {
      stepNumber: "1",
      icon: Ticket,
      title: "1. Escolha suas cartelas 3x5",
      description: "Cada cartela tem 3 linhas por 5 colunas (15 números de 1 a 90). Compre a partir de R$ 1,00 via PIX ou saldo.",
      badge: "Cartela 3x5 (15 nºs)",
      themeColor: "blue",
    },
    {
      stepNumber: "2",
      icon: Radio,
      title: "2. Acompanhe as 90 bolas ao vivo",
      description: "O globo sorteia bolas de 1 a 90 em tempo real. O sistema confere e marca suas cartelas automaticamente sem você perder nada!",
      badge: "Globo de 90 Bolas",
      themeColor: "coral",
    },
    {
      stepNumber: "3",
      icon: Zap,
      title: "3. Ganhe em 3 faixas no PIX",
      description: "Concorra a 1 Linha, 2 Linhas e Bingo (3 Linhas / Cartela Cheia). Os prêmios caem no seu saldo na hora com saque PIX imediato!",
      badge: "3 Prêmios por rodada",
      themeColor: "gold",
    },
  ];

  return (
    <section className="home-section how-to-play-section" aria-labelledby="how-to-play-heading">
      <div className="how-to-play-header">
        <h2 id="how-to-play-heading" className="how-to-play-title">
          Como funciona o <span className="highlight-text">Bingo Show</span>?
        </h2>
        <p className="how-to-play-subtitle">
          O Bingo Show utiliza o formato clássico de <strong>90 bolas</strong> com <strong>cartelas 3x5</strong> (15 números). Em cada rodada, você tem <strong>3 chances de ganhar</strong>:
        </p>
      </div>

      {/* 3 Step Cards */}
      <div className="how-to-play-steps-grid">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.stepNumber} className={`step-card step-card-${step.themeColor}`}>
              <div className="step-card-header">
                <span className="step-number-badge">{step.stepNumber}</span>
                <span className="step-highlight-tag">{step.badge}</span>
              </div>

              <div className="step-icon-box">
                <Icon className="step-svg" />
              </div>

              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
            </div>
          );
        })}
      </div>

      {/* 3 Prizes Highlight Strip */}
      <div className="how-to-play-prizes-strip">
        <div className="prize-strip-item">
          <div className="prize-strip-badge badge-tier1">1º Prêmio</div>
          <strong>1 Linha</strong>
          <span>5 números completados em qualquer linha</span>
        </div>
        <div className="prize-strip-separator" />
        <div className="prize-strip-item">
          <div className="prize-strip-badge badge-tier2">2º Prêmio</div>
          <strong>2 Linhas</strong>
          <span>10 números completados em 2 linhas</span>
        </div>
        <div className="prize-strip-separator" />
        <div className="prize-strip-item">
          <div className="prize-strip-badge badge-tier3">3º Prêmio Máximo</div>
          <strong>BINGO (3 Linhas)</strong>
          <span>Cartela cheia (15 nºs) + Acumulado</span>
        </div>
      </div>

      {/* Bottom Trust & Direct Bet Action */}
      <div className="how-to-play-footer-callout">
        <div className="callout-left">
          <ShieldCheck className="shield-icon" />
          <div>
            <strong>100% Seguro & Regulamentado</strong>
            <span>Globo certificado de 90 bolas, marcação sem erros e saque PIX instantâneo.</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onBuyTickets}
          className="btn-how-to-play-action"
          id="how-to-play-start-btn"
        >
          <span>Apostar agora</span>
          <ArrowRight className="btn-icon" />
        </button>
      </div>
    </section>
  );
}


