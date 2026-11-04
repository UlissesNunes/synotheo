export const TESTAMENTS = ['old', 'new'] as const;
export type Testament = (typeof TESTAMENTS)[number];

export const BOOK_DIVISIONS = [
  'law',
  'history',
  'poetry',
  'prophets',
  'gospels',
  'letters',
] as const;
export type BookDivision = (typeof BOOK_DIVISIONS)[number];

export type OriginalLanguage = 'hebrew' | 'greek';

/** Posição canônica: 1 (Gênesis) a 66 (Apocalipse). */
export type CanonicalOrder = number & { readonly __brand: 'CanonicalOrder' };

export const TOTAL_BOOKS = 66;
export const LAST_OLD_TESTAMENT_ORDER = 39;

export interface BibleBook {
  readonly slug: string;
  readonly order: CanonicalOrder;
  readonly name: string;
  readonly abbreviation: string;
  readonly transliteration: string;
  readonly originalName: string;
  readonly language: OriginalLanguage;
  readonly testament: Testament;
  readonly division: BookDivision;
  readonly chapters: number;
  readonly traditionalAuthor: string;
  readonly theme: string;
}

export function toCanonicalOrder(value: number): CanonicalOrder {
  if (!Number.isInteger(value) || value < 1 || value > TOTAL_BOOKS) {
    throw new RangeError(`Posição canônica inválida: ${String(value)}`);
  }
  return value as CanonicalOrder;
}
