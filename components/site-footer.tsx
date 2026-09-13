"use client";

import React from "react";
import Link from "next/link";
import { Heart, Instagram, Facebook, Youtube } from "lucide-react";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer-inner">
        {/* Brand & Slogan */}
        <div className="footer-brand-col">
          <Logo />
          <p className="footer-tagline">
            Mais pessoas. Mais histórias. Sempre bingo.
          </p>
        </div>

        {/* Links Navigation */}
        <nav className="footer-nav" aria-label="Navegação do rodapé">
          <Link href="/">Início</Link>
          <Link href="/draws">Sorteios</Link>
          <a href="#promocoes">Promoções</a>
          <a href="#ganhadores">Ganhadores</a>
          <a href="#ajuda">Ajuda</a>
          <a href="#contato">Contato</a>
        </nav>

        {/* Social Media & Signoff */}
        <div className="footer-social-col">
          <div className="footer-social-links" aria-label="Redes sociais">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Instagram"
            >
              <Instagram className="social-svg" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Facebook"
            >
              <Facebook className="social-svg" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="YouTube"
            >
              <Youtube className="social-svg" />
            </a>
          </div>

          <div className="footer-joy-sign">
            <span>Jogue com alegria</span>
            <Heart className="joy-heart" />
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>© {new Date().getFullYear()} Bingo Show. Todos os direitos reservados. Jogue com responsabilidade (+18).</p>
      </div>
    </footer>
  );
}
