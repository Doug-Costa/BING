import type { AuthData } from './types';
import { jwtDecode } from 'jwt-decode';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
let refreshInFlight: Promise<AuthData> | null = null;

// Extrai o email do token JWT (se existir)
function getEmailFromToken(token: string): string | undefined {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.email || undefined;
  } catch {
    return undefined;
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  let token = typeof window !== 'undefined' ? localStorage.getItem('bingo_token') : null;
  let response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (response.status === 401 && typeof window !== 'undefined' && path !== '/auth/player/refresh' && path !== '/seanless/session/refresh') {
    try {
      const refreshed = await refreshAccessToken();
      token = refreshed.access_token;
      response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...init?.headers,
        },
      });
    } catch {}
  }

  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('bingo_token');
    localStorage.removeItem('bingo_refresh_token');
    localStorage.removeItem('bingo_user');
    window.dispatchEvent(new CustomEvent('bingo:auth-expired'));
    throw new Error('Sua sessão expirou. Entre novamente para continuar.');
  }
  if (!response.ok) throw new Error(data.message || 'Não foi possível completar a operação.');
  return data as T;
}

// Login normal (e‑mail e senha)
export async function login(email: string, password: string) {
  const data = await api<AuthData>('/auth/player/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!data.email && data.access_token) {
    const tokenEmail = getEmailFromToken(data.access_token);
    if (tokenEmail) data.email = tokenEmail;
  }
  saveAuth(data);
  return data;
}

// Login via Telegram
export async function telegramLogin(telegramId: string) {
  const data = await api<AuthData>('/auth/telegram-login', {
    method: 'POST',
    body: JSON.stringify({ telegramId }),
  });
  if (!data.email && data.access_token) {
    const tokenEmail = getEmailFromToken(data.access_token);
    if (tokenEmail) data.email = tokenEmail;
    else data.email = `${telegramId}@telegram.bot`;
  }
  saveAuth(data);
  return data;
}

// Login Seamless (parceiro)
export async function seamlessLogin(token: string) {
  const decoded: any = jwtDecode(token);
  const email = decoded.email || decoded.sub || '';
  const authData: AuthData = {
    access_token: token,
    refresh_token: decoded.refresh_token || token,
    scope: decoded.scope || 'PLAYER',
    display_name: decoded.display_name || decoded.name || '',
    email: email,
    playerId: decoded.sub || decoded.playerId || '',
    loginPlayerId: decoded.sub || '',
    balance: decoded.balance || 0,
    companyId: decoded.companyId || '',
    resellerId: decoded.resellerId || '',
    partnerId: decoded.partnerId || '',
    operatorId: decoded.operatorId || '',
    affiliateId: decoded.affiliateId || '',
    affiliatename: decoded.affiliatename || '',
    img_url: null,
    url_img: null,
    country: decoded.country || 'BR',
    coin: decoded.currency || 'BRL',
    symbol: decoded.symbol || 'R$',
    language: decoded.language || 'pt-BR',
    pinbingo: decoded.pinbingo || '',
    providerId: decoded.providerId || '',
    externalPlayerId: decoded.externalPlayerId || '',
    playerType: decoded.playerType || 'SEAMLESS',
    isSeamless: true,
  };
  saveAuth(authData);
  return authData;
}

export function saveAuth(data: AuthData) {
  localStorage.setItem('bingo_token', data.access_token);
  if (data.refresh_token) {
    localStorage.setItem('bingo_refresh_token', data.refresh_token);
  }
  if (data.isSeamless) {
    localStorage.setItem('bingo_is_seamless', 'true');
  } else {
    localStorage.removeItem('bingo_is_seamless');
  }
  localStorage.setItem('bingo_user', JSON.stringify(data));
}

export async function refreshAccessToken(): Promise<AuthData> {
  if (refreshInFlight) return refreshInFlight;

  const refreshToken = localStorage.getItem('bingo_refresh_token');
  if (!refreshToken) throw new Error('Refresh token indisponível.');

  const isSeamless = localStorage.getItem('bingo_is_seamless') === 'true';
  const refreshPath = isSeamless ? '/seanless/session/refresh' : '/auth/player/refresh';

  refreshInFlight = fetch(`${API_URL}${refreshPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.access_token) {
        throw new Error(data.message || 'Não foi possível renovar a sessão.');
      }
      const merged = {
        ...JSON.parse(localStorage.getItem('bingo_user') || '{}'),
        access_token: data.sessionToken || data.access_token,
        refresh_token: data.refreshToken || data.refresh_token,
        isSeamless: isSeamless,
      } as AuthData;
      if (!merged.email && merged.access_token) {
        const tokenEmail = getEmailFromToken(merged.access_token);
        if (tokenEmail) merged.email = tokenEmail;
      }
      saveAuth(merged);
      window.dispatchEvent(new CustomEvent('bingo:auth-refreshed', { detail: merged }));
      return merged;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

export function logout() {
  localStorage.removeItem('bingo_token');
  localStorage.removeItem('bingo_refresh_token');
  localStorage.removeItem('bingo_user');
  localStorage.removeItem('bingo_is_seamless');
  window.dispatchEvent(new CustomEvent('bingo:auth-expired'));
}