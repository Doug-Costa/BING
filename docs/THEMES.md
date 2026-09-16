# 🎨 Arquitetura e Especificação de Temas - Bingo Show

Esta documentação descreve o padrão de **arquitetura de temas desacoplada** adotado no projeto **Bingo Show**, estruturado em camadas de design tokens em TypeScript, assets estáticos centralizados e componentes visuais agnósticos.

---

## 📁 1. Estrutura de Pastas

```
bingo-show-web/
├── public/
│   └── themes/
│       └── bingo-show/                   # Assets estáticos do tema
│           ├── backgrounds/              # Fundos (2x, 4x, dark, space, particle)
│           ├── balls/                    # Texturas e artes de bolas 3D
│           ├── borders/                  # Bordas neon, vidro e efeitos
│           ├── cards/                    # Cartelas vazias, marcadas e premiadas
│           ├── decorative/               # Elementos gráficos decorativos
│           ├── effects/                  # Brilhos, halos e iluminação
│           ├── icons/                    # Ícones temáticos (trevo, moedas, etc.)
│           ├── logos/                    # Logotipos da marca (SVG/PNG/glow)
│           ├── panels/                   # Molduras de painéis e modais
│           ├── particles/                # Partículas e poeira estelar
│           └── textures/                 # Padrões e texturas de fundo
│
├── lib/
│   ├── theme/
│   │   ├── types.ts                      # Interfaces e tipos de tokens (ThemeTokens)
│   │   ├── assets.ts                     # Mapeamento dos assets estáticos (/themes/...)
│   │   ├── colors.ts                     # Paletas de cores tipadas
│   │   ├── typography.ts                 # Configuração tipográfica e fontes
│   │   ├── themes.ts                     # Instâncias dos temas e função resolveTheme()
│   │   └── index.ts                      # Barrel export do módulo de temas
│   └── theme-context.tsx                 # React Context, ThemeProvider e useThemeTokens()
│
└── components/
    └── theme/                            # Componentes visuais dinâmicos da UI/TV
        ├── ThemeBackground.tsx           # Fundo dinâmico baseado em tokens
        ├── ThemePanel.tsx                # Painel com borda/glow dinâmicos
        ├── ThemeCard.tsx                 # Card/Cartela de bingo orientada a tokens
        ├── ThemeBall.tsx                 # Bola 3D com cores dinâmicas
        ├── ThemeLogo.tsx                 # Logotipo dinâmico do tema
        ├── ThemeText.tsx                 # Tipografia padronizada
        └── index.ts                      # Barrel export dos componentes
```

---

## 📐 2. Camadas da Arquitetura

```
┌──────────────────────────────────────────────────────────┐
│                   PUBLIC ASSETS                          │
│   public/themes/<nome-do-tema>/ (backgrounds, balls...)  │
└────────────────────────────┬─────────────────────────────┘
                             │ mapeado por
┌────────────────────────────▼─────────────────────────────┐
│                    DESIGN TOKENS (TS)                    │
│   • lib/theme/assets.ts     ➔ URLs (/themes/...)         │
│   • lib/theme/colors.ts     ➔ Paletas de cores           │
│   • lib/theme/typography.ts ➔ Fontes, pesos e escalas    │
│   • lib/theme/themes.ts     ➔ ThemeTokens unificado      │
│   • resolveTheme()          ➔ Seletor e fallback         │
└────────────────────────────┬─────────────────────────────┘
                             │ consumido por
┌────────────────────────────▼─────────────────────────────┐
│               COMPONENTES DINÂMICOS (UI)                 │
│   ThemeCard, ThemePanel, ThemeBackground, Ball, etc.     │
│   (Zero cores/caminhos fixos no JSX)                     │
└──────────────────────────────────────────────────────────┘
```

---

## 🚀 3. Como Importar ou Adicionar um Novo Tema

Para plugar um novo tema (ex: `temaOuro`, `temaNeonAmbar`, `temaPubAzul` ou outro), o processo é direto e padronizado em **4 passos**:

### Passo 1: Copiar os Assets Estáticos
Copie a pasta de imagens do tema para:
```bash
public/themes/<novo-tema>/
```

### Passo 2: Mapear Assets e Cores
No arquivo `lib/theme/assets.ts`, adicione o mapa apontando para a pasta:
```typescript
const NOVO_TEMA_BASE = "/themes/<novo-tema>";

export const novoTemaAssets: ThemeAssets = {
  basePath: NOVO_TEMA_BASE,
  backgrounds: {
    main: `${NOVO_TEMA_BASE}/backgrounds/2x/bg-main.png`,
    dark: `${NOVO_TEMA_BASE}/backgrounds/2x/bg-dark.png`,
    glow: `${NOVO_TEMA_BASE}/backgrounds/2x/bg-glow.png`,
  },
  logos: {
    main: `${NOVO_TEMA_BASE}/logos/logo-main.png`,
  },
  panels: {
    main: `${NOVO_TEMA_BASE}/panels/2x/panel-main.png`,
  },
  borders: { ... },
  cards: { ... },
  icons: { ... },
  ballsPath: `${NOVO_TEMA_BASE}/balls`,
};
```

Em `lib/theme/colors.ts`, defina a paleta:
```typescript
export const colorsNovoTema: ThemeColors = {
  bgPage: "#0a0700",
  bgSurface: "rgba(28, 20, 2, 0.95)",
  bgSurfaceElevated: "#231802",
  textPrimary: "#FFF8E7",
  textSecondary: "#D4AF37",
  textMuted: "#8C7322",
  primary: "#FFD700",
  primaryHover: "#FFF066",
  primaryLight: "rgba(255, 215, 0, 0.2)",
  gold: "#FFD700",
  // ... demais cores da interface ThemeColors
};
```

### Passo 3: Declarar o novo `ThemeTokens`
Em `lib/theme/themes.ts`, instancie o objeto do tema:
```typescript
export const temaNovo: ThemeTokens = {
  id: "novo-tema",
  name: "Novo Tema Incrível",
  icon: "✨",
  description: "Visual personalizado e imersivo",
  mode: "dark",
  colors: colorsNovoTema,
  assets: novoTemaAssets,
  typography: defaultTypography,
};
```

### Passo 4: Atualizar o Seletor (`resolveTheme`)
No final de `lib/theme/themes.ts`:
```typescript
export function resolveTheme(themeInput?: any): ThemeTokens {
  const name = typeof themeInput === "string" ? themeInput.toLowerCase() : (themeInput?.id || themeInput?.name || "").toLowerCase();
  
  if (name === "novo-tema" || name === "tema01") return temaNovo;
  if (name === "blue" || name === "live") return temaBingoShow;
  if (name === "light" || name === "claro") return temaLight;
  
  return THEMES_MAP[name] || temaLight; // fallback padrão
}
```

---

## 💻 4. Como Usar nos Componentes React

### Acesso aos Tokens via Hook:
```tsx
import { useThemeTokens, useTheme } from "@/lib/theme-context";

export function MeuComponente() {
  const tokens = useThemeTokens();
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ color: tokens.colors.primary, backgroundColor: tokens.colors.bgSurface }}>
      <h1>{tokens.name}</h1>
    </div>
  );
}
```

### Uso dos Componentes Visuais Dinâmicos:
```tsx
import { ThemeBackground, ThemePanel, ThemeCard, ThemeBall, ThemeLogo } from "@/components/theme";

export function ExemploSalaAoVivo() {
  return (
    <ThemeBackground variant="space" showOverlay>
      <ThemeLogo variant="main" width={180} />
      
      <ThemePanel variant="glass" glow>
        <h2>Sorteio ao Vivo</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <ThemeBall number={7} colorVariant="gold" />
          <ThemeBall number={42} colorVariant="blue" />
        </div>
      </ThemePanel>

      <ThemeCard variant="winner">
        <p>Cartela Premiada</p>
      </ThemeCard>
    </ThemeBackground>
  );
}
```

---

## ⚙️ 5. Compatibilidade com CSS Legado e Variáveis
O `ThemeProvider` em `lib/theme-context.tsx` mantém sincronizado o atributo `data-theme` na tag raiz `<html>` (`<html data-theme="light">` ou `<html data-theme="blue">`). Isso garante compatibilidade direta com todas as variáveis CSS definidas em `app/home.css` e `app/globals.css`.
