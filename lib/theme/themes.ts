import { ThemeTokens, ThemeOption } from "./types";
import { colorsBingoShow, colorsLight, colorsOuro } from "./colors";
import { bingoShowAssets, lightThemeAssets } from "./assets";
import { defaultTypography } from "./typography";

export const temaBingoShow: ThemeTokens = {
  id: "blue",
  name: "Tema Azul Live",
  icon: "🌌",
  description: "Tema clássico e imersivo da sala ao vivo",
  mode: "dark",
  colors: colorsBingoShow,
  assets: bingoShowAssets,
  typography: defaultTypography,
};

export const temaLight: ThemeTokens = {
  id: "light",
  name: "Tema Claro",
  icon: "☀️",
  description: "Visual moderno, limpo e vibrante",
  mode: "light",
  colors: colorsLight,
  assets: lightThemeAssets,
  typography: defaultTypography,
};

export const temaOuro: ThemeTokens = {
  id: "ouro",
  name: "Tema Ouro Imperial",
  icon: "👑",
  description: "Visual luxuoso dourado",
  mode: "dark",
  colors: colorsOuro,
  assets: bingoShowAssets,
  typography: defaultTypography,
};

export const AVAILABLE_THEMES: ThemeOption[] = [
  {
    id: "light",
    name: "Tema Claro",
    icon: "☀️",
    description: "Visual moderno, limpo e vibrante",
  },
  {
    id: "blue",
    name: "Tema Azul Live",
    icon: "🌌",
    description: "Tema clássico e imersivo da sala ao vivo",
  },
];

export const THEMES_MAP: Record<string, ThemeTokens> = {
  light: temaLight,
  blue: temaBingoShow,
  "bingo-show": temaBingoShow,
  ouro: temaOuro,
};

/**
 * Resolve o objeto ThemeTokens correspondente a partir de um ID, nome ou objeto.
 * Fallback padrão: temaLight (ou temaBingoShow se especificado).
 */
export function resolveTheme(themeInput?: string | { id?: string; name?: string } | null): ThemeTokens {
  if (!themeInput) return temaLight;
  
  const idOrName = typeof themeInput === "string" ? themeInput.toLowerCase() : (themeInput.id || themeInput.name || "").toLowerCase();
  
  if (idOrName === "blue" || idOrName === "bingo-show" || idOrName === "live" || idOrName === "dark") {
    return temaBingoShow;
  }
  
  if (idOrName === "ouro" || idOrName === "gold") {
    return temaOuro;
  }
  
  if (idOrName === "light" || idOrName === "claro") {
    return temaLight;
  }
  
  return THEMES_MAP[idOrName] || temaLight;
}
