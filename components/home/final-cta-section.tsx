"use client";

import React from "react";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

interface FinalCtaSectionProps {
  onBuyTickets: () => void;
}

export function FinalCtaSection({ onBuyTickets }: FinalCtaSectionProps) {
  return (
    <section className="home-section final-cta-section" aria-label="Chamada para Ação Final">
      <div className="final-cta-card">
        {/* Background Graphic Layer */}
        <div className="final-cta-bg-wrapper">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="/assets/home/cta-mobile.png"
            />
            <img
              src="/assets/home/cta-desktop.png"
              alt=""
              className="final-cta-bg-img"
              loading="lazy"
            />
          </picture>
        </div>

        {/* Content Layer */}
        <div className="final-cta-content">
          <div className="final-cta-copy">
            <h2 className="final-cta-title">Pronto para apostar e ganhar?</h2>
            <p className="final-cta-subtitle">
              Garanta suas cartelas a partir de R$ 1,00, acompanhe ao vivo e receba seus prêmios via PIX na hora!
            </p>
          </div>

          <div className="final-cta-action">
            <button
              type="button"
              className="btn-final-buy"
              onClick={onBuyTickets}
              id="final-cta-buy-btn"
            >
              <span>Apostar agora</span>
              <ArrowRight className="btn-icon" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

