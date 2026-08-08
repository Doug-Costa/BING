"use client";

import { CalendarDays, Clover, Clock, Heart, Hourglass, Radio, Volume2, VolumeX, Wifi, WifiOff, X } from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { InnerShell } from "@/components/inner-shell";
import { useApp } from "@/components/app-provider";
import { LiveNextDraw } from "@/components/live-buy-modal";
import { api } from "@/lib/api";

type Card = number[][];
type ActiveCard = { id: string; ticketId: string; numbers: Card };
type CloseWinner = { ticketId?: string; playerName?: string; targetPrize?: string; minNumbersLeft?: number; missing?: number[]; missingNumbers?: number[]; linesCompleted?: number; fullTicket?: Card };
type Winner = { ticketId?: string; playerName?: string; name?: string; share?: number; prize?: number; prizeAmount?: number; value?: number; line?: number; jackpotShare?: number };
type WinnerNotice = { title: string; subtitle: string; winners: Winner[]; amount?: number; jackpotAmount?: number; jackpot?: boolean; split?: boolean; mine?: boolean };
type DrawSummary = { winners: Winner[]; nextDraws?: unknown[]; jackpotAmount?: number; jackpotWinners?: Winner[] };
type Prizes = { line1: number; line2: number; line3: number };
type PendingWinnerGroup = { timer: ReturnType<typeof setTimeout>; line: number; winners: Winner[]; lineValue: number; jackpotAmount: number };

const demoBalls = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,78,79,80,81,82,83,84,85,86,87,88,89,90];
const demoCards: Card[] = [
  [[3,17,34,49,61],[8,21,0,53,70],[11,26,38,57,74]],
  [[2,18,33,47,65],[7,22,0,54,73],[12,29,39,58,77]],
  [[1,16,32,48,63],[6,20,0,52,71],[15,25,36,55,76]],
  [[4,19,35,50,66],[9,23,0,56,72],[13,28,37,59,78]]
];

const demoTopWinners: CloseWinner[] = [
  { ticketId: "000476", playerName: "FLAVIA GISELE PRESTES", missingNumbers: [17, 43] },
  { ticketId: "000012", playerName: "TATA", missingNumbers: [3, 19, 76] },
  { ticketId: "000053", playerName: "ROSANGELA PEDRO", missingNumbers: [28, 43, 75] },
  { ticketId: "000066", playerName: "ALDAIR JOSÉ DE MENEZES", missingNumbers: [12, 45, 87] },
  { ticketId: "000083", playerName: "CHALE PALMEIRAS", missingNumbers: [25, 51, 88] },
  { ticketId: "000134", playerName: "VARGÃO", missingNumbers: [20, 57, 85] },
  { ticketId: "000247", playerName: "ALBERTO SOUZA DA SILVA", missingNumbers: [5, 24, 59] },
  { ticketId: "000261", playerName: "ALBERTO SOUZA DA SILVA", missingNumbers: [9, 28, 59] },
  { ticketId: "000320", playerName: "NÁGILA SOUZA", missingNumbers: [14, 58, 67] }
];

export default function LivePage() {
  const { user, openAuth, muted, setMuted } = useApp();
  const demoMode = process.env.NEXT_PUBLIC_SSE_DEMO_MODE === "true";
  const [current, setCurrent] = useState(demoMode ? 11 : 0);
  const [balls, setBalls] = useState<number[]>(demoMode ? demoBalls : []);
  const [cards, setCards] = useState<ActiveCard[]>(demoMode ? demoCards.map((numbers,index)=>({id:`demo-${index}`,ticketId:`demo-${index}`,numbers})) : []);
  const [topWinners, setTopWinners] = useState<CloseWinner[]>(demoMode ? demoTopWinners : []);
  const [topWinnersStage, setTopWinnersStage] = useState(1);
  const [connected, setConnected] = useState(false);
  const [jackpot, setJackpot] = useState(demoMode ? 204.79 : 0);
  const [prizes, setPrizes] = useState<Prizes>(demoMode ? { line1: 10, line2: 20, line3: 100 } : { line1: 0, line2: 0, line3: 0 });
  const [wonLines, setWonLines] = useState<number[]>([]);
  const [drawActive, setDrawActive] = useState(false);
  const [winnerNotice, setWinnerNotice] = useState<WinnerNotice | null>(null);
  const [summary, setSummary] = useState<DrawSummary | null>(null);
  const [connectionError, setConnectionError] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const summaryDelayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeVisibleUntilRef = useRef(0);
  const cardsRef = useRef<ActiveCard[]>([]);
  const prizesRef = useRef<Prizes>({ line1: 0, line2: 0, line3: 0 });
  const currentDrawIdRef = useRef("");
  const currentBallRef = useRef(0);
  const finishedDrawIdsRef = useRef(new Set<string>());
  const pendingWinnerGroupsRef = useRef(new Map<string, PendingWinnerGroup>());
  const jackpotResultRef = useRef<{ amount: number; winners: Winner[] }>({ amount: 0, winners: [] });

  useEffect(() => { cardsRef.current = cards; }, [cards]);
  useEffect(() => { prizesRef.current = prizes; }, [prizes]);
  useEffect(() => () => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    if (finishTimer.current) clearTimeout(finishTimer.current);
    if (summaryDelayTimer.current) clearTimeout(summaryDelayTimer.current);
    pendingWinnerGroupsRef.current.forEach(group => clearTimeout(group.timer));
    pendingWinnerGroupsRef.current.clear();
  }, []);

  function showWinner(notice: WinnerNotice, duration = 9000) {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setWinnerNotice(notice);
    noticeVisibleUntilRef.current = Date.now() + duration;
    noticeTimer.current = setTimeout(() => setWinnerNotice(null), duration);
  }

  function flushWinnerGroup(key: string) {
    const group = pendingWinnerGroupsRef.current.get(key);
    if (!group) return;
    pendingWinnerGroupsRef.current.delete(key);
    const winners = uniqueWinners(group.winners);
    const split = winners.length > 1;
    const ownIds = new Set(cardsRef.current.map(card => card.ticketId));
    const mine = winners.some(winner => ownIds.has(String(winner.ticketId || "").split("_")[0]));
    const names = group.line === 3 ? "BINGO!" : `${group.line}ª LINHA!`;
    showWinner({
      title: mine ? "VOCÊ GANHOU!" : names,
      subtitle: split ? "PRÊMIO DIVIDIDO!" : mine ? `PARABÉNS! ${names}` : "TEMOS UM GANHADOR",
      winners,
      amount: group.lineValue,
      jackpotAmount: group.jackpotAmount,
      jackpot: group.jackpotAmount > 0,
      split,
      mine
    }, group.jackpotAmount > 0 ? 12000 : 9000);
  }

  function queueLineWinner(data: any, line: number, lineValue: number) {
    const normalized = normalizeWinners(extractWinnerItems(data), { ...data, fallbackPrize: lineValue });
    const hasJackpot = Boolean(data.hasJackpot || data.jackpotWon);
    const eventJackpot = hasJackpot ? safeNumber(data.jackpotAmount) : 0;
    const winners = normalized.map(winner => ({
      ...winner,
      jackpotShare: hasJackpot ? safeNumber((winner as any).jackpotAmount) || eventJackpot / Math.max(1, normalized.length) : 0
    }));
    if (hasJackpot) recordJackpot(winners, eventJackpot);
    const key = `${currentDrawIdRef.current}:${currentBallRef.current}:${line}`;
    const previous = pendingWinnerGroupsRef.current.get(key);
    if (previous) clearTimeout(previous.timer);
    const group = {
      line,
      lineValue,
      winners: [...(previous?.winners || []), ...winners],
      jackpotAmount: safeNumber(previous?.jackpotAmount) + eventJackpot,
      timer: setTimeout(() => flushWinnerGroup(key), 450)
    };
    pendingWinnerGroupsRef.current.set(key, group);
  }

  function recordJackpot(winners: Winner[], amount: number, replace = false) {
    jackpotResultRef.current = {
      amount: replace ? amount : jackpotResultRef.current.amount + amount,
      winners: uniqueWinners([...(replace ? [] : jackpotResultRef.current.winners), ...winners])
    };
  }

  async function loadDrawValues(drawId?: string) {
    if (!drawId) return;
    try {
      const draw = await api<Record<string,any>>(`/bingo/draws/${drawId}`);
      if (currentDrawIdRef.current !== drawId) return;
      setPrizes(normalizePrizes(draw));
      const amount = safeNumber(draw.jackpotAmount ?? draw.value_jackpot ?? draw.jackpot?.currentAmount ?? draw.jackpot?.baseAmount);
      if (amount > 0) setJackpot(amount);
    } catch {}
  }

  useEffect(() => {
    if (!user?.access_token) return;
    const base = (process.env.NEXT_PUBLIC_SSE_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    if (!base) { setConnectionError("Endereço SSE não configurado."); return; }
    const storedToken = localStorage.getItem("bingo_token") || user.access_token;
    const token = storedToken.trim().replace(/^Bearer\s+/i, "").replace(/^["']|["']$/g, "");
    const pin = user.pinbingo !== null && user.pinbingo !== undefined ? String(user.pinbingo).trim().padStart(6, "0") : "";
    if (!pin && token.split(".").length !== 3) { setConnectionError("Autenticação inválida. Saia e entre novamente."); return; }
    const url = new URL("/bingo/realtime-sse/stream", base);
    if (pin) url.searchParams.set("pin", pin); else url.searchParams.set("token", token);
    url.searchParams.set("roomId", String(process.env.NEXT_PUBLIC_ROOM_ID || ""));
    const stream = new EventSource(url.toString());
    stream.onopen = () => { setConnected(true); setConnectionError(""); };
    stream.onerror = () => { setConnected(false); setConnectionError(value => value || "Conexão rejeitada ou interrompida."); };

    const handle = (event: MessageEvent) => {
      try {
        const payload = JSON.parse(event.data);
        const type = payload.type || event.type;
        const data = unwrapData(payload);
        if (type === "error") { setConnectionError(data.message || data.error || String(data)); stream.close(); return; }
        if (type === "snapshot") {
          const state = payload.state || data.state || {};
          const drawId = String(state.drawId || state.thisDraw?.id || "");
          currentDrawIdRef.current = drawId;
          if (!drawId && !demoMode) { setBalls([]); setCurrent(0); setTopWinners([]); setCards([]); }
          const status = String(state.status || state.thisDraw?.status || "").toUpperCase();
          setDrawActive(Boolean(drawId && ["STARTED","IN_PROGRESS"].includes(status)));
          const received = normalizeBalls(state.balls);
          currentBallRef.current = received.at(-1) || 0;
          if (received.length) { setBalls(received); setCurrent(currentBallRef.current); }
          if (state.topWinners) setTopWinners(state.topWinners);
          setTopWinnersStage(normalizeStage(state.topWinnersStage, state.lineWinners));
          setJackpot(normalizeJackpot(state));
          setPrizes(normalizePrizes(state));
          setWonLines((state.lineWinners||[]).map((item:any)=>normalizeLine(item.type??item.line??item.lineNumber)).filter(Boolean));
          const snapshotJackpotWinners = (state.lineWinners || []).filter((item: any) => item.hasJackpot);
          jackpotResultRef.current = {
            amount: snapshotJackpotWinners.reduce((sum: number, item: any) => sum + safeNumber(item.jackpotAmount), 0),
            winners: normalizeWinners(snapshotJackpotWinners, {})
          };
          if (!state.thisDraw) loadDrawValues(drawId);
        }
        if (type === "my_tickets") {
          const tickets = payload.tickets || data.tickets || [];
          const activeDrawId = currentDrawIdRef.current;
          const activeTickets = tickets.filter((ticket: { drawId?: string; status?: string }) => {
            const sameDraw = !activeDrawId || String(ticket.drawId || "") === activeDrawId;
            const status = String(ticket.status || "").toUpperCase();
            return sameDraw && !["COMPLETED","CANCELLED","CANCELED","REFUNDED"].includes(status);
          });
          setCards(activeTickets.flatMap((ticket: { id?: string; ticketId?: string; numbers?: { numbers: Card }[] },ticketIndex: number) =>
            (ticket.numbers || []).map((item,cardIndex) => ({
              id: `${ticket.id || ticket.ticketId || ticketIndex}-${cardIndex}`,
              ticketId: String(ticket.id || ticket.ticketId || ""),
              numbers: item.numbers
            }))
          ));
        }
        if (type === "draw_start") {
          const drawId = String(data.drawId ?? data.id ?? "");
          currentDrawIdRef.current = drawId;
          currentBallRef.current = 0;
          jackpotResultRef.current = { amount: 0, winners: [] };
          if (drawId) finishedDrawIdsRef.current.delete(drawId);
          setBalls([]); setCurrent(0); setTopWinners([]); setTopWinnersStage(1); setCards([]); setSummary(null); setWonLines([]); setDrawActive(true);
          setPrizes(normalizePrizes(data));
          setJackpot(safeNumber(data.jackpotAmount ?? data.value_jackpot ?? data.jackpot?.currentAmount));
          loadDrawValues(drawId);
        }
        if (type === "new_ball") {
          const number = normalizeBall(data.number ?? data.ball ?? data.ballNumber);
          if (number) {
            currentBallRef.current = number;
            setCurrent(number);
            setBalls(previous => previous.includes(number) ? previous : [...previous, number]);
          }
        }
        if (type === "top_winners") {
          setTopWinners(data.items || data.topWinners || []);
          setTopWinnersStage(normalizeStage(data.stage));
        }
        if (type === "line_winner") {
          const line = detectLine(data);
          if (line) setWonLines(previous => previous.includes(line) ? previous : [...previous, line]);
          if (line < 3) setTopWinnersStage(line + 1);
          const lineValue = line === 1 ? prizesRef.current.line1 : line === 2 ? prizesRef.current.line2 : line === 3 ? prizesRef.current.line3 : 0;
          queueLineWinner(data, line, lineValue);
        }
        if (type === "jackpot_paid") {
          const winners = normalizeWinners(data.winners || [], data);
          const paidAmount = safeNumber(data.jackpotAmount ?? data.amount);
          recordJackpot(winners, paidAmount, true);
          const ownIds = new Set(cardsRef.current.map(card => card.ticketId));
          const mine = winners.some(winner => ownIds.has(String(winner.ticketId || "").split("_")[0]));
          showWinner({ title: mine ? "VOCÊ GANHOU O JACKPOT!" : "JACKPOT!", subtitle: winners.length > 1 ? "JACKPOT DIVIDIDO!" : mine ? "PARABÉNS, O ACUMULADO É SEU!" : "O ACUMULADO SAIU!", winners, jackpotAmount: paidAmount, jackpot: true, split: winners.length > 1, mine }, 12000);
        }
        if (type === "jackpot_info") setJackpot(Number(data.currentAmount || 0) + Number(data.baseAmount || 0));
        if (type === "jackpot_trigger_update" || type === "jackpot_delayed") setJackpot(previous => safeNumber(data.jackpotAmount) || previous);
        if (type === "draw_finish" || type === "draw_end") {
          const drawId = String(data.drawId || currentDrawIdRef.current);
          if (drawId && finishedDrawIdsRef.current.has(drawId)) return;
          if (drawId) finishedDrawIdsRef.current.add(drawId);
          pendingWinnerGroupsRef.current.forEach((group, key) => { clearTimeout(group.timer); flushWinnerGroup(key); });
          setCards([]); setTopWinners([]); setDrawActive(false);
          const finalSummary = { winners: normalizeDrawWinners(data.winners || [], data), nextDraws: data.nextDraws || [], jackpotAmount: jackpotResultRef.current.amount, jackpotWinners: jackpotResultRef.current.winners };
          const showSummary = () => {
            setSummary(finalSummary);
            if (finishTimer.current) clearTimeout(finishTimer.current);
            finishTimer.current = setTimeout(() => setSummary(null), 15000);
          };
          const delay = Math.max(0, noticeVisibleUntilRef.current - Date.now() + 250);
          if (summaryDelayTimer.current) clearTimeout(summaryDelayTimer.current);
          if (delay) summaryDelayTimer.current = setTimeout(showSummary, delay); else showSummary();
        }
        if (type === "draw_cancel") { currentDrawIdRef.current = ""; currentBallRef.current = 0; jackpotResultRef.current = { amount: 0, winners: [] }; setDrawActive(false); setBalls([]); setCurrent(0); setCards([]); setTopWinners([]); setTopWinnersStage(1); }
      } catch { if (event.type === "error" && event.data) setConnectionError(String(event.data)); }
    };
    ["message","error","snapshot","my_tickets","new_ball","jackpot_info","jackpot_trigger_update","jackpot_delayed","jackpot_paid","draw_start","draw_finish","draw_end","draw_cancel","next_draws","top_winners","line_winner"].forEach(name => stream.addEventListener(name, handle));
    return () => stream.close();
  }, [user, demoMode]);

  const lastBalls = useMemo(() => balls.slice(-3).reverse(), [balls]);
  const ballSet = useMemo(() => new Set(balls), [balls]);
  const orderedCards = useMemo(() => [...cards].sort((a,b) => remaining(a.numbers,ballSet) - remaining(b.numbers,ballSet)), [cards,ballSet]);
  const displayCards = useMemo(() => {
    const result: { id: string; ticketId?: string; numbers: Card }[] = [];
    for (let i = 0; i < 4; i++) {
      if (orderedCards[i]) {
        result.push(orderedCards[i]);
      } else {
        result.push({
          id: `placeholder-${i}`,
          ticketId: `demo-${i}`,
          numbers: demoCards[i % demoCards.length]
        });
      }
    }
    return result;
  }, [orderedCards]);
  const orderedTopWinners = useMemo(() => normalizeTopWinners(topWinners, ballSet, topWinnersStage), [topWinners, ballSet, topWinnersStage]);

  return (
    <InnerShell live>
      {!user && (
        <div className="live-login">
          <WifiOff />
          <p>Entre para conectar suas cartelas e acompanhar o sorteio.</p>
          <button onClick={() => openAuth("login")}>Entrar</button>
        </div>
      )}
      {user && connectionError && (
        <div className="live-login sse-error">
          <WifiOff />
          <p><b>Falha na conexão:</b> {connectionError}</p>
        </div>
      )}
      {user && !connected && !demoMode && !connectionError && (
        <div className="live-waiting panel">
          <div className="loader" />
          <h2>Conectando ao sorteio...</h2>
        </div>
      )}

      {/* MAIN GAME BOARD */}
      <section className={`live-board ${connected ? "connected-board" : "disconnected-board"} ${demoMode ? "demo-on" : "demo-off"}`}>
        {/* LEFT/CENTER BLOCK */}
        <div className="live-left-center-block">
          <div className="live-left-center-top">
            {/* LEFT PANEL: ACUMULADO, PRÊMIOS, INFO SQUARES */}
            <aside className="prizes panel">
              <div className={`jackpot-live ${prizeState(0, wonLines, drawActive)}`}>
                <img src="/theme-bingo-show/icons/icon-money-bag.svg" alt="Acumulado" className="jackpot-icon-img" />
                <div className="jackpot-info-col">
                  <small>ACUMULADO</small>
                  <strong>{money(jackpot)}</strong>
                </div>
              </div>
              {[
                ["PRÊMIO 1", prizes.line1, 1],
                ["PRÊMIO 2", prizes.line2, 2],
                ["PRÊMIO 3", prizes.line3, 3]
              ].map(item => (
                <div className={`prize-line ${prizeState(Number(item[2]), wonLines, drawActive)}`} key={item[0]}>
                  <small>{item[0]}</small>
                  <strong>{money(Number(item[1]))}</strong>
                </div>
              ))}
              <div className="info-squares-grid">
                <div className="info-sq">
                  <Clover className="info-icon green" />
                  <div>
                    <small>SORTEIO</small>
                    <b>{currentDrawIdRef.current ? currentDrawIdRef.current.slice(-6) : "465149"}</b>
                  </div>
                </div>
                <div className="info-sq">
                  <Heart className="info-icon cyan" />
                  <div>
                    <small>DOAÇÃO</small>
                    <b>R$ 0,20</b>
                  </div>
                </div>
                <div className="info-sq">
                  <CalendarDays className="info-icon blue" />
                  <div>
                    <small>DATA</small>
                    <b>{new Date().toLocaleDateString("pt-BR")}</b>
                  </div>
                </div>
                <div className="info-sq">
                  <Clock className="info-icon gold" />
                  <div>
                    <small>HORA</small>
                    <b>{new Date().toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</b>
                  </div>
                </div>
              </div>
            </aside>

            {/* CENTER COLUMN: DRAW STAGE */}
            <section className="number-stage panel">
              <div className="stage-header">
                <h2>★ NÚMERO SORTEADO ★</h2>
                <span className="upcoming-label">PRÓXIMOS NÚMEROS</span>
              </div>
              <div className="stage-body">
                <div className="mega-ball">
                  <span>{current || "—"}</span>
                </div>
                <div className="next-numbers-stack">
                  {(lastBalls.length ? lastBalls : [30, 65, 90]).slice(0, 3).map((number, index) => {
                    const isPlaceholder = lastBalls.length === 0;
                    const colorClass = isPlaceholder ? "undrawn" : getBallColorClass(number);
                    return (
                      <div className={`next-ball-3d ${colorClass}`} key={`${number}-${index}`}>
                        <span>{number}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="stage-footer panel">
                <div className="next-timer-box">
                  <div className="timer-icon-wrap">
                    <Hourglass className="timer-icon" />
                  </div>
                  <div className="timer-text-col">
                    <span>PRÓXIMO NÚMERO EM</span>
                    <b className="live-timer-countdown">00:30</b>
                  </div>
                </div>
                <div className="bingo-cage-graphic">
                  <img src="/theme-bingo-show/bingo-cage.jpg" alt="Globo de Bingo Dourado" className="bingo-cage-img" />
                </div>
              </div>
            </section>
          </div>

          {/* BOTTOM FULL-WIDTH COLUMN: ÚLTIMOS NÚMEROS SORTEADOS */}
          <section className="ball-history panel">
            <h2>☘ ÚLTIMOS NÚMEROS SORTEADOS ☘</h2>
            <div className="balls-90-grid">
              {Array.from({ length: 90 }, (_, index) => index + 1).map(number => {
                const isDrawn = ballSet.has(number);
                const isCurrent = number === current;
                const colorClass = getBallColorClass(number);
                return (
                  <span
                    className={`ball-90-item ${isCurrent ? "current" : isDrawn ? `drawn ${colorClass}` : "undrawn"}`}
                    key={number}
                  >
                    {number}
                  </span>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="live-right-block">
          {/* RIGHT TOP COLUMN: DOADOR / RANKING TABLE */}
          <aside className="players panel">
            <div className="players-head">
              <b>CUPOM</b>
              <b>DOADOR</b>
              <b>FALTAM <span className="head-rings"><i/><i/><i/><i/><i/></span></b>
            </div>
            {orderedTopWinners.length ? (
              orderedTopWinners.slice(0, 7).map(({ item, left, key, missing }) => (
                <div className="player-row" key={key}>
                  <b className="cupom-code">{item.ticketId ? String(item.ticketId).slice(-6).padStart(6, "0") : "000476"}</b>
                  <strong className="doador-name">
                    {item.playerName || "Jogador"}
                    {item.targetPrize ? <small>{prizeLabel(item.targetPrize)}</small> : null}
                  </strong>
                  <span className="missing-pills">
                    {missing.length ? (
                      missing.slice(0, 4).map(number => <i key={number}>{String(number).padStart(2, "0")}</i>)
                    ) : (
                      <i>{left}</i>
                    )}
                  </span>
                </div>
              ))
            ) : (
              <div className="top-empty">Aguardando jogadores próximos de ganhar...</div>
            )}
          </aside>

          {/* RIGHT BOTTOM COLUMN: MINHAS CARTELAS */}
          <section className="my-cards panel">
            <h2>
              <span className="clover-group">
                <Clover className="clover-icon" />
                <Clover className="clover-icon" />
              </span>
              <span>MINHAS CARTELAS</span>
              <span className="clover-group">
                <Clover className="clover-icon" />
                <Clover className="clover-icon" />
              </span>
            </h2>
            <div className="cards-grid-2x2">
              {displayCards.map((card, index) => (
                <BingoCard
                  card={card.numbers}
                  index={index}
                  balls={ballSet}
                  urgent={card.numbers ? remaining(card.numbers, ballSet) <= 2 : false}
                  key={card.id || `card-${index}`}
                />
              ))}
            </div>
          </section>
        </div>
      </section>

      <div className={connected ? "connection on" : "connection"}>
        {connected ? <Wifi /> : <WifiOff />}
        {connected ? "Conectado ao vivo" : user ? "SSE desconectado" : "Aguardando autenticação"}
      </div>

      {winnerNotice && <WinnerOverlay notice={winnerNotice} onClose={() => setWinnerNotice(null)} />}
      {summary && <SummaryOverlay summary={summary} onClose={() => setSummary(null)} />}
    </InnerShell>
  );
}

const BingoCard = memo(function BingoCard({ card, index, balls, urgent }: { card: Card; index: number; balls: Set<number>; urgent?: boolean }) {
  return (
    <article className={`bingo-card ${urgent ? "urgent-card" : ""}`}>
      <div className="bingo-card-inner">
        <strong className="card-header-badge">CARTELA {String(index + 1).padStart(2, "0")}</strong>
        <div className="card-cells-grid">
          {card.flat().map((number, i) => (
            <span className={number && balls.has(number) ? "marked" : (number === 0 || i === 7) ? "free-star" : ""} key={i}>
              {i === 7 || number === 0 ? "⭐" : String(number).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
});

function WinnerOverlay({ notice, onClose }: { notice: WinnerNotice; onClose: () => void }) {
  return (
    <div className={`winner-overlay ${notice.jackpot ? "jackpot-win" : ""} ${notice.mine ? "my-win" : ""}`}>
      <div className="coin-rain">
        {Array.from({ length: 24 }, (_, i) => (
          <i style={{ "--i": i } as React.CSSProperties} key={i}>●</i>
        ))}
      </div>
      <section>
        <i className="winner-side-light left" />
        <i className="winner-side-light right" />
        <button onClick={onClose} aria-label="Fechar"><X /></button>
        {notice.split && <b className="split-badge">DIVIDIDO!</b>}
        <p>{notice.subtitle}</p>
        <h2>{notice.title}</h2>
        {notice.amount ? <strong className="won-amount">{money(notice.amount)}</strong> : null}
        {notice.jackpot && notice.jackpotAmount ? <strong className="won-jackpot">+ JACKPOT {money(notice.jackpotAmount)}</strong> : null}
        <div>
          {notice.winners.map((winner, index) => (
            <article key={`${winner.ticketId}-${index}`}>
              <span>🏆</span>
              <b>{winner.playerName || winner.name || `Ganhador ${index + 1}`}</b>
              <strong>{money(winnerAmount(winner, notice.amount))}</strong>
              {winner.jackpotShare ? <small>+ Jackpot {money(winner.jackpotShare)}</small> : null}
            </article>
          ))}
        </div>
        <small>Este aviso fechará automaticamente.</small>
      </section>
    </div>
  );
}

function SummaryOverlay({ summary, onClose }: { summary: DrawSummary; onClose: () => void }) {
  return (
    <div className="winner-overlay summary-overlay">
      <section>
        <i className="winner-side-light left" />
        <i className="winner-side-light right" />
        <button onClick={onClose} aria-label="Fechar"><X /></button>
        <p>SORTEIO ENCERRADO</p>
        <h2>Resumo de ganhadores</h2>
        <div className="summary-winners">
          {[1, 2, 3].map(line => {
            const winners = summary.winners.filter(w => Number(w.line) === line);
            const split = winners.length > 1;
            return (
              <article key={line}>
                <span>{line === 3 ? "BINGO" : `${line}ª LINHA`}</span>
                <b>
                  {winners.length ? winners.map(w => w.playerName || "Jogador").join(", ") : "Sem ganhador informado"}
                  {split && <small className="summary-split">DIVIDIDO</small>}
                </b>
                <strong>{money(winners.reduce((sum, w) => sum + Number(w.share ?? w.prize ?? 0), 0))}</strong>
              </article>
            );
          })}
          {summary.jackpotWinners && summary.jackpotWinners.length > 0 && safeNumber(summary.jackpotAmount) > 0 && (
            <article className="summary-jackpot">
              <span>JACKPOT</span>
              <b>{summary.jackpotWinners?.map(winner => winner.playerName || winner.name || "Jogador").join(", ") || "Jackpot pago"}</b>
              <strong>{money(summary.jackpotAmount || 0)}</strong>
            </article>
          )}
        </div>
        <small>Este resumo fechará em 15 segundos. Você continuará na transmissão.</small>
      </section>
    </div>
  );
}

function getBallColorClass(number: number) {
  if (number <= 15) return "ball-blue";
  if (number <= 30) return "ball-red";
  if (number <= 45) return "ball-green";
  if (number <= 60) return "ball-yellow";
  if (number <= 75) return "ball-purple";
  return "ball-gold";
}

function safeNumber(value: unknown) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; }
function money(value: number) { return `R$ ${safeNumber(value).toLocaleString("pt-BR",{minimumFractionDigits:2})}`; }
function normalizePrizes(source: Record<string, any>): Prizes {
  const nested = source.thisDraw || source.draw || source.prizes || source;
  return {
    line1: safeNumber(nested.prizeLine1 ?? nested.prize1 ?? nested.value_prize1),
    line2: safeNumber(nested.prizeLine2 ?? nested.prize2 ?? nested.value_prize2),
    line3: safeNumber(nested.prizeLine3 ?? nested.prize3 ?? nested.value_prize3),
  };
}
function normalizeBall(value: unknown) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 90 ? number : 0;
}
function normalizeBalls(value: unknown) {
  if (!Array.isArray(value)) return [];
  const unique = new Set<number>();
  value.forEach(item => {
    const number = normalizeBall(item);
    if (number) unique.add(number);
  });
  return [...unique];
}
function normalizeJackpot(source: Record<string, any>) {
  const info = source.jackpotInfo || source.jackpot || {};
  return safeNumber(source.jackpotAmount ?? info.totalAmount ?? (safeNumber(info.baseAmount) + safeNumber(info.currentAmount)));
}
function normalizeWinners(items: any[], parent: Record<string,any>): Winner[] {
  return items.map(item => ({
    ...item,
    ticketId: item.ticketId ?? item.ticket?.id,
    playerName: item.playerName ?? item.playername ?? item.winnerName ?? item.displayName ?? item.name ?? item.player?.name,
    line: safeNumber(item.line ?? parent.line ?? parent.lineNumber),
    share: safeNumber(item.share ?? item.prize ?? item.prizeAmount ?? item.prizeValue ?? item.value ?? item.amount ?? item.totalPrize ?? parent.share ?? parent.prizeAmount ?? parent.prizeValue ?? parent.prize ?? parent.value ?? parent.amount ?? parent.fallbackPrize)
  }));
}
function normalizeDrawWinners(items: any[], parent: Record<string,any>): Winner[] {
  return items.flatMap(group => {
    if (Array.isArray(group?.winners)) return normalizeWinners(group.winners, { ...parent, ...group });
    return normalizeWinners([group], parent);
  });
}
function winnerAmount(winner: Winner, fallback?: number) { return safeNumber(winner.share ?? winner.prize ?? winner.prizeAmount ?? winner.value ?? fallback); }
function uniqueWinners(winners: Winner[]) {
  const unique = new Map<string, Winner>();
  winners.forEach((winner, index) => unique.set(String(winner.ticketId || `${winner.playerName || winner.name}-${index}`), winner));
  return [...unique.values()];
}
function remaining(card: Card, balls: Set<number>) { return card.flat().filter(number => number > 0 && !balls.has(number)).length; }
function closeWinnerLeft(item: CloseWinner) {
  const value = Number(item.minNumbersLeft);
  if (Number.isFinite(value)) return value;
  return (item.missingNumbers || item.missing || []).length;
}
function prizeLabel(value: unknown) {
  const line = normalizeLine(value);
  return line === 1 ? "1ª LINHA" : line === 2 ? "2ª LINHA" : line === 3 ? "BINGO" : "";
}
function normalizeTopWinners(items: CloseWinner[], balls: Set<number>, stage: number) {
  const occurrences = new Map<string, number>();
  return items.map((item, index) => {
    const ticketId = String(item.ticketId || "").trim();
    const cardKey = item.fullTicket?.flat().join("-") || `${item.playerName || "jogador"}-${index}`;
    const baseKey = `${ticketId || item.playerName || "jogador"}-${cardKey}`;
    const occurrence = occurrences.get(baseKey) || 0;
    occurrences.set(baseKey, occurrence + 1);
    const sourceMissing = normalizeBalls(item.missingNumbers || item.missing);
    const missing = sourceMissing.filter(number => !balls.has(number));
    const left = item.fullTicket?.length ? liveWinnerLeft(item, balls, stage) : sourceMissing.length ? missing.length : closeWinnerLeft(item);
    return { item, index, left, missing, completed: !item.fullTicket?.length && sourceMissing.length > 0 && missing.length === 0, key: `${baseKey}-${occurrence}` };
  })
    .filter(candidate => !candidate.completed)
    .sort((a, b) => a.left - b.left || a.index - b.index);
}
function liveWinnerLeft(item: CloseWinner, balls: Set<number>, stage: number) {
  if (!Array.isArray(item.fullTicket) || !item.fullTicket.length) return closeWinnerLeft(item);
  const rows = item.fullTicket.map(row => row.filter(number => number > 0 && !balls.has(number)).length).sort((a, b) => a - b);
  if (stage === 1) return rows[0] ?? closeWinnerLeft(item);
  if (stage === 2) return (rows[0] ?? 0) + (rows[1] ?? 0);
  return rows.reduce((total, left) => total + left, 0);
}
function normalizeStage(value: unknown, lineWinners: any[] = []) {
  const stage = normalizeLine(value);
  if (stage) return stage;
  const won = lineWinners.map(item => normalizeLine(item.type ?? item.line ?? item.lineNumber));
  return won.includes(2) ? 3 : won.includes(1) ? 2 : 1;
}
function normalizeLine(value: unknown) {
  const text = String(value ?? "").toLowerCase();
  if (text === "bingo" || text === "line3" || text === "linha3") return 3;
  if (text === "line2" || text === "linha2") return 2;
  if (text === "line1" || text === "linha1") return 1;
  if(text.includes("primeir"))return 1;
  if(text.includes("segund"))return 2;
  if(text.includes("terceir"))return 3;
  const digit = text.match(/[123]/)?.[0];
  return digit ? Number(digit) : safeNumber(value);
}
function detectLine(data:any){
  const direct=data.line??data.lineNumber??data.prizeLine??data.stage??data.lineIndex??data.winningLine??data.prizeNumber??data.type;
  const normalized=normalizeLine(direct);
  if(normalized)return normalized;
  for(const [key,value] of Object.entries(data||{})){
    if(/line|linha|prize|premio/i.test(key)){const found=normalizeLine(value);if(found)return found}
  }
  return 0;
}
function unwrapData(payload:any){let value=payload;for(let i=0;i<4&&value?.data&&typeof value.data==="object";i++)value=value.data;return value}
function prizeState(line:number,won:number[],active:boolean){if(!active)return "normal";if(line>0&&won.includes(line))return "prize-won";const stage=won.includes(2)?2:won.includes(1)?1:0;if(stage===0)return "prize-active";if(stage===1&&(line===2||line===0))return "prize-active";if(stage===2&&(line===3||line===0))return "prize-active";return "normal"}
function extractWinnerItems(data:any):any[]{
  const candidate=data.winners??data.lineWinners??data.players??data.items??data.winner;
  if(Array.isArray(candidate)&&candidate.length)return candidate;
  if(candidate&&typeof candidate==="object")return [candidate];
  if(data.playerName||data.name||data.ticketId)return [data];
  return [{playerName:"Ganhador",share:data.prize??data.prizeAmount??data.value??data.amount}];
}
