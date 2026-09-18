import { ThemeTokens, ThemeOption } from "./types";
import { colorsBingoShow, colorsLight, colorsOuro } from "./colors";
import { bingoShowAssets, lightThemeAssets } from "./assets";
import { defaultTypography } from "./typography";

export const temaBingoShow: ThemeTokens = {
  id: "blue",
  name: "Bingo Show Blue (Azul Live)",
  icon: "🌌",
  description: "Tema imersivo espacial com iluminação neon e fundo escuro",
  mode: "dark",
  colors: colorsBingoShow,
  assets: bingoShowAssets,
  typography: defaultTypography,
};

export const temaOuro: ThemeTokens = {
  id: "ouro",
  name: "Ouro Imperial VIP",
  icon: "👑",
  description: "Visual nobre de alto luxo em dourado e âmbar",
  mode: "dark",
  colors: colorsOuro,
  assets: bingoShowAssets,
  typography: defaultTypography,
};

export const temaLight: ThemeTokens = {
  id: "light",
  name: "Tema Claro Web",
  icon: "☀️",
  description: "Visual claro, moderno e limpo para navegação web",
  mode: "light",
  colors: colorsLight,
  assets: lightThemeAssets,
  typography: defaultTypography,
};

export const AVAILABLE_THEMES: ThemeOption[] = [
  {
    id: "blue",
    name: "Bingo Show Blue (Azul Live)",
    icon: "🌌",
    description: "Tema imersivo espacial com iluminação neon e fundo escuro",
  },
  {
    id: "ouro",
    name: "Ouro Imperial VIP",
    icon: "👑",
    description: "Visual nobre de alto luxo em dourado e âmbar",
  },
  {
    id: "light",
    name: "Tema Claro Web",
    icon: "☀️",
    description: "Visual claro, moderno e limpo para navegação web",
  },
];

export const THEMES_MAP: Record<string, ThemeTokens> = {
  blue: temaBingoShow,
  "bingo-show": temaBingoShow,
  "bingo-show-blue": temaBingoShow,
  ouro: temaOuro,
  light: temaLight,
};

/**
 * Resolve o objeto ThemeTokens correspondente a partir de um ID, nome ou objeto.
 * Fallback padrão: temaBingoShow (Azul Live).
 */
export function resolveTheme(themeInput?: string | { id?: string; name?: string } | null): ThemeTokens {
  if (!themeInput) return temaBingoShow;
  
  const idOrName = typeof themeInput === "string" ? themeInput.toLowerCase() : (themeInput.id || themeInput.name || "").toLowerCase();
  
  if (idOrName === "blue" || idOrName === "bingo-show" || idOrName === "bingo-show-blue" || idOrName === "live" || idOrName === "dark") {
    return temaBingoShow;
  }
  
  if (idOrName === "ouro" || idOrName === "gold") {
    return temaOuro;
  }
  
  if (idOrName === "light" || idOrName === "claro") {
    return temaLight;
  }
  
  return THEMES_MAP[idOrName] || temaBingoShow;
}
