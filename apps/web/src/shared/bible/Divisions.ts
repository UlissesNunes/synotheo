import { type BookDivision } from './Bible';

export const DIVISION_LABELS = {
  law: 'Lei',
  history: 'História',
  poetry: 'Poesia',
  prophets: 'Profetas',
  gospels: 'Evangelhos',
  letters: 'Cartas',
} as const satisfies Record<BookDivision, string>;
