"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Radio, Sparkles, Heart, Star, Users, Crown, Zap, ShieldCheck } from "lucide-react";

interface HeroSectionProps {
  onBuyTickets: () => void;
}

export function HeroSection({ onBuyTickets }: HeroSectionProps) {
  return (
    <section className="home-hero-section" aria-label="Apresentação Bingo Show">
      {/* Background Graphic Layer */}
      <div className="home-hero-bg-wrapper">
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet="/assets/home/hero-mobile.png"
          />
          <img
            src="/assets/home/hero-desktop.png"
            alt="Globo dourado e bolas de bingo 3D vibrantes"
            className="home-hero-bg-img"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="home-hero-overlay-glow" />
      </div>

      {/* Hero Content Container */}
      <div className="home-hero-container">
        {/* Left Column: Headlines & Actions */}
        <div className="home-hero-copy">
          <div className="home-hero-eyebrow">
            <span className="live-pulse-dot" />
            <Sparkles className="eyebrow-icon" />
            <span>BINGO DE 90 BOLAS • CARTELAS 3x5 • 3 PRÊMIOS</span>
          </div>

          <h1 className="home-hero-title">
            O bingo ao vivo mais <br />
            <span className="gradient-text">fácil de jogar e ganhar</span>
          </h1>

          <p className="home-hero-desc">
            Cartelas a partir de <strong>R$ 1,00</strong> (modelo <strong>3x5</strong>). Concorra a <strong>1 Linha, 2 Linhas e Bingo</strong> com marcação automática e receba prêmios no <strong>PIX</strong> na hora!
          </p>

          <div className="home-hero-actions">
            <button
              type="button"
              className="btn-hero-primary"
              onClick={onBuyTickets}
              id="hero-buy-btn"
            >
              <span>Apostar agora</span>
              <ArrowRight className="btn-icon" />
            </button>

            <Link
              href="/live"
              className="btn-hero-secondary"
              id="hero-live-btn"
            >
              <span className="live-indicator-dot" />
              <Radio className="btn-icon live-icon" />
              <span>Ver sorteio ao vivo</span>
            </Link>
          </div>
        </div>

        {/* Floating Interactive Badges (Clean 2-badge setup) */}
        <div className="home-hero-floating-elements" aria-hidden="true">
          <div className="floating-card badge-daily float-anim-1">
            <span className="badge-text">Diversão todos os dias</span>
            <Star className="badge-icon icon-yellow" />
          </div>

          <div className="floating-card badge-moments float-anim-2">
            <div className="badge-icon-box bg-gold">
              <Crown className="box-icon" />
            </div>
            <div className="badge-info">
              <strong>Grandes prêmios</strong>
              <span>no PIX</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

