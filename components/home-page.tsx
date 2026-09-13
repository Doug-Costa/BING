"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "./header";
import { AuthModal } from "./auth-modal";
import { SiteFooter } from "./site-footer";
import { useApp } from "./app-provider";
import { telegramLogin, seamlessLogin } from "@/lib/api";

// Modular Home Components
import { HeroSection } from "./home/hero-section";
import { BenefitsBar } from "./home/benefits-bar";
import { HowToPlaySection } from "./home/how-to-play-section";
import { NextDrawsSection } from "./home/next-draws-section";
import { LiveBannerSection } from "./home/live-banner-section";
import { PromotionsSection } from "./home/promotions-section";
import { WinnersSection } from "./home/winners-section";
import { FinalCtaSection } from "./home/final-cta-section";

export function HomePage() {
  const { user, openAuth, setUser } = useApp();
  const searchParams = useSearchParams();

  // Efeito para login automático via Telegram ou Seamless e rastreamento de afiliado
  useEffect(() => {
    const telegramId = searchParams.get("telegramId");
    const token = searchParams.get("token");
    const affiliate = searchParams.get("affiliate");

    // Salva código de afiliado, se presente
    if (affiliate) {
      localStorage.setItem("bingo_affiliate_id", affiliate);
      try {
        document.cookie = `bingo_affiliate_id=${encodeURIComponent(affiliate)};path=/;max-age=${30 * 24 * 60 * 60};SameSite=Lax`;
      } catch {}
    }

    // Se já estiver logado (token no localStorage) ou já tem usuário, não faz nada
    if (user || localStorage.getItem("bingo_token")) {
      return;
    }

    const performLogin = async () => {
      try {
        let authData = null;
        if (telegramId) {
          authData = await telegramLogin(telegramId);
        } else if (token) {
          authData = await seamlessLogin(token);
        }

        if (authData) {
          setUser(authData);
          // Remove os parâmetros da URL para não ficarem expostos
          const url = new URL(window.location.href);
          url.searchParams.delete("telegramId");
          url.searchParams.delete("token");
          window.history.replaceState({}, "", url.toString());
        }
      } catch (error) {
        console.error("Falha no login automático:", error);
      }
    };

    performLogin();
  }, [searchParams, user, setUser]);

  // Ação principal de compra de cartelas
  const handleBuyTickets = () => {
    if (user) {
      location.assign("/draws");
    } else {
      openAuth("register");
    }
  };

  return (
    <div className="home-page-root">
      {/* Dynamic Ambient Glow */}
      <div className="home-ambient" aria-hidden="true">
        <i className="ambient-blob b1" />
        <i className="ambient-blob b2" />
        <i className="ambient-blob b3" />
      </div>

      <Header />

      <main className="home-main-content">
        <HeroSection onBuyTickets={handleBuyTickets} />
        <BenefitsBar />
        <HowToPlaySection onBuyTickets={handleBuyTickets} />
        <NextDrawsSection />
        <LiveBannerSection />
        <PromotionsSection />
        <WinnersSection />
        <FinalCtaSection onBuyTickets={handleBuyTickets} />
      </main>

      <SiteFooter />
      <AuthModal />
    </div>
  );
}