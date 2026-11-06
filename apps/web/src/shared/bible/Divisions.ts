import { type BookDivision, type Testament } from './Bible';

export const DIVISION_LABELS = {
  law: 'Lei',
  history: 'História',
  poetry: 'Poesia',
  prophets: 'Profetas',
  gospels: 'Evangelhos',
  letters: 'Cartas',
} as const satisfies Record<BookDivision, string>;

export const TESTAMENT_LABELS = {
  old: 'Antigo Testamento',
  new: 'Novo Testamento',
} as const satisfies Record<Testament, string>;
