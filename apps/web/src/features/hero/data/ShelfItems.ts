import { BIBLE_BOOKS, type BibleBook } from '@/shared/bible';

/** Quantas vezes a lista inteira se repete, para o laço nunca mostrar a emenda. */
export const SHELF_COPIES = 3;

export interface ShelfItem {
  readonly virtualIndex: number;
  readonly book: BibleBook;
}

export const SHELF_ITEMS: readonly ShelfItem[] = Array.from({ length: SHELF_COPIES }, (_, copy) =>
  BIBLE_BOOKS.map((book, index) => ({
    virtualIndex: copy * BIBLE_BOOKS.length + index,
    book,
  })),
).flat();
