"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Radio, Heart } from "lucide-react";

export function LiveBannerSection() {
  return (
    <section className="home-section live-banner-section" aria-label="Destaque Sorteio ao Vivo">
      <div className="live-banner-card">
        {/* Background Graphic Layer */}
        <div className="live-banner-bg-wrapper">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="/assets/home/live-mobile.png"
            />
            <img
              src="/assets/home/live-desktop.png"
              alt=""
              className="live-banner-bg-img"
              loading="lazy"
            />
          </picture>
        </div>

        {/* Content Overlay */}
        <div className="live-banner-content">
          <div className="live-banner-badge" aria-live="polite">
            <span className="live-pulse-dot" />
            <Radio className="live-badge-icon" />
            <span>AO VIVO AGORA</span>
          </div>

          <h2 className="live-banner-title">Sala de Sorteio Ao Vivo</h2>

          <p className="live-banner-subtitle">
            Transmissão em tempo real com globo girando. Assista, torça e vibre a cada bola sorteada!
          </p>

          <div className="live-banner-action">
            <Link href="/live" className="btn-live-watch" id="live-banner-watch-btn">
              <span>Entrar no sorteio ao vivo</span>
              <ArrowRight className="btn-icon" />
            </Link>
          </div>
        </div>

        {/* Handwritten Tag on Desktop */}
        <div className="live-handwritten-tag desktop-only" aria-hidden="true">
          <span>Juntos a diversão é maior!</span>
          <Heart className="handwritten-heart" />
        </div>
      </div>
    </section>
  );
}

