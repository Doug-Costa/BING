
'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  BadgeCheck,
  ChevronRight,
  Gift,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  Users,
  WalletCards,
  Zap,
} from 'lucide-react';
import { Header } from './header';
import { AuthModal } from './auth-modal';
import { DrawList } from './draw-list';
import { useApp } from './app-provider';
import { SiteFooter } from './site-footer';
import { telegramLogin, seamlessLogin } from '@/lib/api';

const winners = [
  ['Flávia G.', 'Bingo Especial', 'R$ 5.000,00', 'Hoje às 15:42'],
  ['Carlos A.', 'Bingo da Tarde', 'R$ 2.000,00', 'Hoje às 13:18'],
  ['Marcos S.', 'Bingo da Manhã', 'R$ 1.000,00', 'Hoje às 11:05'],
];

export function HomePage() {
  const { user, openAuth, setUser } = useApp();
  const searchParams = useSearchParams();

  // Efeito para login automático via Telegram ou Seamless
  useEffect(() => {
    const telegramId = searchParams.get('telegramId');
    const token = searchParams.get('token');
    const affiliate = searchParams.get('affiliate');

    // Salva código de afiliado, se presente
    if (affiliate) {
      localStorage.setItem('bingo_affiliate_id', affiliate);
    }

    // Se já estiver logado (token no localStorage) ou já tem usuário, não faz nada
    if (user || localStorage.getItem('bingo_token')) {
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
          url.searchParams.delete('telegramId');
          url.searchParams.delete('token');
          window.history.replaceState({}, '', url.toString());
        }
      } catch (error) {
        console.error('Falha no login automático:', error);
        // Se falhar, não redireciona, apenas mostra erro (opcional)
      }
    };

    performLogin();
  }, [searchParams, user, setUser]);

  // Função "Comprar"
  const buy = () => (user ? location.assign('/draws') : openAuth('register'));

  return (
    <>
      <div className="ambient">
        <i />
        <i />
        <i />
      </div>
      <main className="site-shell">
        <Header />
        <section className="hero-grid">
          <article className="hero">
            <div className="hero-content">
              <p className="eyebrow">
                <Sparkles /> TODO DIA É DIA DE SORTE
              </p>
              <h1>
                A sua sorte<br />
                <em>pode mudar</em>
                <br />
                <span>hoje!</span>
              </h1>
              <p>
                Diversão que <b>premia de verdade.</b>
              </p>
              <button className="btn btn-gold hero-button" onClick={buy}>
                <Ticket />
                Comprar tickets <ChevronRight />
              </button>
            </div>
            <div className="float-ball ball blue b1">11</div>
            <div className="float-ball ball red b2">30</div>
            <div className="float-ball ball purple b3">90</div>
            <div className="hero-dots">
              <i />
              <i className="active" />
              <i />
            </div>
          </article>
          <DrawList />
        </section>

        <section className="benefit-grid">
          <article className="benefit jackpot">
            <Trophy />
            <div>
              <small>Jackpot acumulado</small>
              <strong>R$ 25.000,00</strong>
            </div>
          </article>
          <article className="benefit">
            <ShieldCheck />
            <div>
              <strong>100% seguro</strong>
              <small>Seus dados sempre protegidos</small>
            </div>
          </article>
          <article className="benefit">
            <Zap />
            <div>
              <strong>Pagamentos rápidos</strong>
              <small>Prêmios pagos via PIX</small>
            </div>
          </article>
          <article className="benefit">
            <Gift />
            <div>
              <strong>Super promoções</strong>
              <small>Mais chances de ganhar</small>
            </div>
          </article>
        </section>

        <section className="lower-grid">
          <article className="panel winners">
            <div className="panel-title">
              <h2>
                <Trophy />
                Últimos ganhadores
              </h2>
              <button>Ver todos</button>
            </div>
            {winners.map((winner, i) => (
              <div className="winner-row" key={winner[0]}>
                <span className={`avatar av${i + 1}`}>{winner[0][0]}</span>
                <strong>{winner[0]}</strong>
                <span>{winner[1]}</span>
                <b>{winner[2]}</b>
                <small>{winner[3]}</small>
              </div>
            ))}
            <div className="crowd">
              <div>
                <Users />
                <b>+10.000</b>
                <small>jogadores online</small>
              </div>
              <div>
                <BadgeCheck />
                <b>Sorteios</b>
                <small>todos os dias</small>
              </div>
              <div>
                <WalletCards />
                <b>Prêmios</b>
                <small>milionários</small>
              </div>
            </div>
          </article>
          <article className="buy-card">
            <div>
              <p className="eyebrow">SUA CHANCE COMEÇA AQUI</p>
              <h2>
                Compre seus
                <br />
                tickets
              </h2>
              <p>
                Escolha seus números
                <br />
                e boa sorte!
              </p>
              <button className="btn btn-gold" onClick={buy}>
                <Ticket />
                Comprar agora
              </button>
            </div>
            <div className="ticket-stack">
              <i />
              <i />
              <i />
            </div>
          </article>
          <article className="promo-card" id="promocoes">
            <span>♛</span>
            <h2>
              BINGO
              <br />
              <em>SHOW</em>
            </h2>
            <p>
              Muito mais que um jogo,
              <br />
              <b>uma experiência!</b>
            </p>
            <Link className="neon-button" href="/draws">
              Jogue agora!
            </Link>
          </article>
        </section>
        <SiteFooter />
      </main>
      <AuthModal />
    </>
  );
}

/*

"use client";

import Link from "next/link";
import { BadgeCheck, ChevronRight, Gift, ShieldCheck, Sparkles, Ticket, Trophy, Users, WalletCards, Zap } from "lucide-react";
import { Header } from "./header";
import { AuthModal } from "./auth-modal";
import { DrawList } from "./draw-list";
import { useApp } from "./app-provider";
import { SiteFooter } from "./site-footer";

const winners = [
  ["Flávia G.", "Bingo Especial", "R$ 5.000,00", "Hoje às 15:42"],
  ["Carlos A.", "Bingo da Tarde", "R$ 2.000,00", "Hoje às 13:18"],
  ["Marcos S.", "Bingo da Manhã", "R$ 1.000,00", "Hoje às 11:05"]
];

export function HomePage() {
  const { user, openAuth } = useApp();
  const buy = () => user ? location.assign("/draws") : openAuth("register");
  return <>
    <div className="ambient"><i /><i /><i /></div>
    <main className="site-shell">
      <Header />
      <section className="hero-grid">
        <article className="hero">
          <div className="hero-content">
            <p className="eyebrow"><Sparkles /> TODO DIA É DIA DE SORTE</p>
            <h1>A sua sorte<br /><em>pode mudar</em><br /><span>hoje!</span></h1>
            <p>Diversão que <b>premia de verdade.</b></p>
            <button className="btn btn-gold hero-button" onClick={buy}><Ticket />Comprar tickets <ChevronRight /></button>
          </div>
          <div className="float-ball ball blue b1">11</div><div className="float-ball ball red b2">30</div><div className="float-ball ball purple b3">90</div>
          <div className="hero-dots"><i /><i className="active" /><i /></div>
        </article>
        <DrawList />
      </section>

      <section className="benefit-grid">
        <article className="benefit jackpot"><Trophy /><div><small>Jackpot acumulado</small><strong>R$ 25.000,00</strong></div></article>
        <article className="benefit"><ShieldCheck /><div><strong>100% seguro</strong><small>Seus dados sempre protegidos</small></div></article>
        <article className="benefit"><Zap /><div><strong>Pagamentos rápidos</strong><small>Prêmios pagos via PIX</small></div></article>
        <article className="benefit"><Gift /><div><strong>Super promoções</strong><small>Mais chances de ganhar</small></div></article>
      </section>

      <section className="lower-grid">
        <article className="panel winners">
          <div className="panel-title"><h2><Trophy />Últimos ganhadores</h2><button>Ver todos</button></div>
          {winners.map((winner, i) => <div className="winner-row" key={winner[0]}>
            <span className={`avatar av${i + 1}`}>{winner[0][0]}</span><strong>{winner[0]}</strong><span>{winner[1]}</span><b>{winner[2]}</b><small>{winner[3]}</small>
          </div>)}
          <div className="crowd"><div><Users /><b>+10.000</b><small>jogadores online</small></div><div><BadgeCheck /><b>Sorteios</b><small>todos os dias</small></div><div><WalletCards /><b>Prêmios</b><small>milionários</small></div></div>
        </article>
        <article className="buy-card"><div><p className="eyebrow">SUA CHANCE COMEÇA AQUI</p><h2>Compre seus<br />tickets</h2><p>Escolha seus números<br />e boa sorte!</p><button className="btn btn-gold" onClick={buy}><Ticket />Comprar agora</button></div><div className="ticket-stack"><i /><i /><i /></div></article>
        <article className="promo-card" id="promocoes"><span>♛</span><h2>BINGO<br /><em>SHOW</em></h2><p>Muito mais que um jogo,<br /><b>uma experiência!</b></p><Link className="neon-button" href="/draws">Jogue agora!</Link></article>
      </section>
      <SiteFooter />
    </main>
    <AuthModal />
  </>;
}
*/