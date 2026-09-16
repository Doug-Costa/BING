import { ThemeAssets } from "./types";

const BINGO_SHOW_BASE = "/themes/bingo-show";

export const bingoShowAssets: ThemeAssets = {
  basePath: BINGO_SHOW_BASE,
  backgrounds: {
    main: `${BINGO_SHOW_BASE}/backgrounds/2x/bg-main.png`,
    dark: `${BINGO_SHOW_BASE}/backgrounds/2x/bg-dark.png`,
    glow: `${BINGO_SHOW_BASE}/backgrounds/2x/bg-glow.png`,
    blueGradient: `${BINGO_SHOW_BASE}/backgrounds/2x/bg-blue-gradient.png`,
    space: `${BINGO_SHOW_BASE}/backgrounds/2x/bg-space.png`,
    particle: `${BINGO_SHOW_BASE}/backgrounds/2x/bg-particle.png`,
  },
  logos: {
    main: `${BINGO_SHOW_BASE}/logos/logo-main.png`,
    mainSvg: `${BINGO_SHOW_BASE}/logos/logo-main.svg`,
    blueSvg: `${BINGO_SHOW_BASE}/logos/logo-blue.svg`,
    goldSvg: `${BINGO_SHOW_BASE}/logos/logo-gold.svg`,
    glow: `${BINGO_SHOW_BASE}/logos/logo-glow.png`,
    glowSvg: `${BINGO_SHOW_BASE}/logos/logo-glow.svg`,
    transparent: `${BINGO_SHOW_BASE}/logos/logo-transparent.png`,
    transparentSvg: `${BINGO_SHOW_BASE}/logos/logo-transparent.svg`,
    starsSvg: `${BINGO_SHOW_BASE}/logos/logo-stars.svg`,
    outlineSvg: `${BINGO_SHOW_BASE}/logos/logo-outline.svg`,
  },
  panels: {
    main: `${BINGO_SHOW_BASE}/panels/2x/panel-main.png`,
    glass: `${BINGO_SHOW_BASE}/panels/2x/panel-glass.png`,
    neon: `${BINGO_SHOW_BASE}/panels/2x/panel-neon.png`,
    dark: `${BINGO_SHOW_BASE}/panels/2x/panel-dark.png`,
    header: `${BINGO_SHOW_BASE}/panels/2x/panel-header.png`,
    footer: `${BINGO_SHOW_BASE}/panels/2x/panel-footer.png`,
    modal: `${BINGO_SHOW_BASE}/panels/2x/panel-modal.png`,
    popup: `${BINGO_SHOW_BASE}/panels/2x/panel-popup.png`,
    sidebar: `${BINGO_SHOW_BASE}/panels/2x/panel-sidebar.png`,
  },
  borders: {
    glass: `${BINGO_SHOW_BASE}/borders/2x/border-glass.png`,
    neonBlue: `${BINGO_SHOW_BASE}/borders/2x/border-neon-blue.png`,
    neonGold: `${BINGO_SHOW_BASE}/borders/2x/border-neon-gold.png`,
    winner: `${BINGO_SHOW_BASE}/borders/2x/border-winner.png`,
    focused: `${BINGO_SHOW_BASE}/borders/2x/border-focused.png`,
  },
  cards: {
    cardEmpty: `${BINGO_SHOW_BASE}/cards/2x/card-empty.png`,
    cardMarked: `${BINGO_SHOW_BASE}/cards/2x/card-marked.png`,
    cardWinner: `${BINGO_SHOW_BASE}/cards/2x/card-winner.png`,
  },
  icons: {
    moneyBag: `${BINGO_SHOW_BASE}/icons/icon-money-bag.png`,
    trevo: `${BINGO_SHOW_BASE}/trevo.png`,
    heart: `${BINGO_SHOW_BASE}/coracao.png`,
    calendar: `${BINGO_SHOW_BASE}/calendario.png`,
    clock: `${BINGO_SHOW_BASE}/relogio.png`,
    hourglass: `${BINGO_SHOW_BASE}/relogio_areia.png`,
    bingoCage: `${BINGO_SHOW_BASE}/bingo-cage.jpg`,
    jackpot: `${BINGO_SHOW_BASE}/icons/icon-jackpot.svg`,
    ticket: `${BINGO_SHOW_BASE}/icons/icon-ticket.svg`,
    wallet: `${BINGO_SHOW_BASE}/icons/icon-wallet.svg`,
    winner: `${BINGO_SHOW_BASE}/icons/icon-winner.svg`,
    star: `${BINGO_SHOW_BASE}/icons/icon-star.svg`,
    coins: `${BINGO_SHOW_BASE}/icons/icon-coins.svg`,
  },
  ballsPath: `${BINGO_SHOW_BASE}/balls`,
};

export const lightThemeAssets: ThemeAssets = {
  ...bingoShowAssets,
  logos: {
    ...bingoShowAssets.logos,
    main: `${BINGO_SHOW_BASE}/logos/logo-main.png`,
  },
};
