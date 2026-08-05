import type { Draw } from "./types";

export function mockDraws(): Draw[] {
  const now = Date.now();
  return [
    { id: "special", scheduledAt: new Date(now + 19 * 60_000).toISOString(), prizeLine1: 500, prizeLine2: 1500, prizeLine3: 5000, ticketPrice: 5, room: { name: "Bingo Especial" } },
    { id: "afternoon", scheduledAt: new Date(now + 139 * 60_000).toISOString(), prizeLine1: 200, prizeLine2: 600, prizeLine3: 2000, ticketPrice: 2, room: { name: "Bingo da Tarde" } },
    { id: "night", scheduledAt: new Date(now + 259 * 60_000).toISOString(), prizeLine1: 1000, prizeLine2: 3000, prizeLine3: 10000, ticketPrice: 10, room: { name: "Bingo da Noite" } }
  ];
}
