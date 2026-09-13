"use client";

import React from "react";
import { Zap, Radio, CheckCircle, ShieldCheck } from "lucide-react";

export function BenefitsBar() {
  const benefits = [
    {
      id: "pix",
      icon: Zap,
      iconClass: "benefit-icon-gold",
      title: "Saque Instantâneo no PIX",
      desc: "Prêmio caiu na conta em segundos",
    },
    {
      id: "prizes",
      icon: Radio,
      iconClass: "benefit-icon-red",
      title: "3 Prêmios por Rodada",
      desc: "1ª Linha, 2ª Linha e Bingo (3 Linhas)",
    },
    {
      id: "auto",
      icon: CheckCircle,
      iconClass: "benefit-icon-blue",
      title: "Globo 90 Bolas Automático",
      desc: "Cartela 3x5 com marcação automática",
    },
  ];

  return (
    <section className="home-benefits-wrapper" aria-label="Diferenciais do Bingo Show">
      <div className="home-benefits-container">
        {benefits.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="home-benefit-item">
              <div className={`benefit-icon-wrapper ${item.iconClass}`}>
                <Icon className="benefit-svg" />
              </div>
              <div className="benefit-text-group">
                <strong className="benefit-title">{item.title}</strong>
                <small className="benefit-desc">{item.desc}</small>
              </div>
              {index < benefits.length - 1 && <div className="benefit-separator" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

