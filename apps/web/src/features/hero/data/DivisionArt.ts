import { type BookDivision } from '@/shared/bible';

export interface DivisionArt {
  readonly background: string;
  readonly ink: string;
  readonly accent: string;
}

/** Paleta de serigrafia do prompt: tinta preta, cobalto, vermelhão e creme. */
export const DIVISION_ART = {
  law: { background: '#e9dcc3', ink: '#141414', accent: '#c2412d' },
  history: { background: '#1f3fb0', ink: '#f2ead8', accent: '#e9b949' },
  poetry: { background: '#c2412d', ink: '#f2ead8', accent: '#141414' },
  prophets: { background: '#141414', ink: '#f2ead8', accent: '#c2412d' },
  gospels: { background: '#f2ead8', ink: '#1f3fb0', accent: '#c2412d' },
  letters: { background: '#e9dcc3', ink: '#1f3fb0', accent: '#141414' },
} as const satisfies Record<BookDivision, DivisionArt>;
