"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface PromotionItem {
  id: string;
  title: string;
  subtitle: string;
  desktopImg: string;
  mobileImg: string;
  href: string;
  badge?: string;
  theme: "purple" | "coral";
}

export const PROMOTIONS_DATA: PromotionItem[] = [
  {
    id: "promo-moments",
    title: "Mais bingo, mais momentos!",
    subtitle: "Aproveite nossas promoções e jogue ainda mais.",
    desktopImg: "/assets/home/promo-purple-desktop.png",
    mobileImg: "/assets/home/promo-purple-mobile.png",
    href: "/draws",
    theme: "purple",
  },
  {
    id: "promo-together",
    title: "Jogue junto, divirta-se mais!",
    subtitle: "Promoções especiais para a nossa comunidade.",
    desktopImg: "/assets/home/promo-coral-desktop.png",
    mobileImg: "/assets/home/promo-coral-mobile.png",
    href: "/draws",
    theme: "coral",
  },
];

export function PromotionsSection() {
  return (
    <section className="home-section promotions-section" id="promocoes" aria-labelledby="promotions-heading">
      <div className="section-header">
        <h2 id="promotions-heading" className="section-title">
          Promoções em destaque
        </h2>
        <Link href="/draws" className="section-link">
          <span>Ver todas</span>
          <ArrowRight className="link-arrow" />
        </Link>
      </div>

      <div className="promotions-grid">
        {PROMOTIONS_DATA.map((promo) => (
          <Link
            key={promo.id}
            href={promo.href}
            className={`promo-card promo-card-${promo.theme}`}
            id={`promo-${promo.id}`}
          >
            {/* Background Graphic */}
            <div className="promo-card-bg-wrapper">
              <picture>
                <source media="(max-width: 768px)" srcSet={promo.mobileImg} />
                <img
                  src={promo.desktopImg}
                  alt=""
                  className="promo-card-bg-img"
                  loading="lazy"
                />
              </picture>
              <div className="promo-card-overlay" />
            </div>

            {/* Foreground Content */}
            <div className="promo-card-content">
              <h3 className="promo-card-title">{promo.title}</h3>
              <p className="promo-card-subtitle">{promo.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
