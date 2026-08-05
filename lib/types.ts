export type Draw = {
  id: string;
  scheduledAt: string;
  prizeLine1: number;
  prizeLine2: number;
  prizeLine3: number;
  jackpotAmount?: number;
  jackpot?: { currentAmount?: number; baseAmount?: number };
  ticketPrice?: number;
  room?: { name: string };
};

export interface AuthData {
  access_token: string;
  refresh_token?: string;
  scope?: string;
  display_name?: string;
  email?: string;                     // <-- adicionado
  playerId: string;
  loginPlayerId?: string;
  balance: string | number;
  companyId: string;
  resellerId: string;
  partnerId?: string;
  operatorId?: string;
  affiliateId?: string;
  affiliatename?: string;
  img_url?: string | null;
  url_img?: string | null;
  country?: string;
  coin?: string;
  symbol?: string;
  language?: string;
  pinbingo?: string;
  providerId?: string;
  externalPlayerId?: string;
  playerType?: 'PLAYER' | 'POS' | 'SEAMLESS';
  isSeamless?: boolean;
}