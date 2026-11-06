import { type BibleBook, type BookDivision } from './Bible';
import { BIBLE_BOOKS, type BookSlug } from './BibleBooks';

const BOOKS_BY_SLUG: ReadonlyMap<string, BibleBook> = new Map(
  BIBLE_BOOKS.map((book) => [book.slug, book]),
);

const VALID_SLUGS: ReadonlySet<string> = new Set(BOOKS_BY_SLUG.keys());

export function isBookSlug(value: string): value is BookSlug {
  return VALID_SLUGS.has(value);
}

export function getBookBySlug(slug: BookSlug): BibleBook {
  const book = BOOKS_BY_SLUG.get(slug);
  if (!book) {
    throw new Error(`Livro não encontrado: ${slug}`);
  }
  return book;
}

/** Livro pela posição na lista (0 = Gênesis, 65 = Apocalipse). */
export function getBookAt(index: number): BibleBook {
  const book = BIBLE_BOOKS[index];
  if (!book) {
    throw new RangeError(`Índice de livro inválido: ${index}`);
  }
  return book;
}

/** Índice (0 a 65) do primeiro livro da divisão. Usado pelas abas da estante. */
export function getFirstBookIndex(division: BookDivision): number {
  const index = BIBLE_BOOKS.findIndex((book) => book.division === division);
  if (index === -1) {
    throw new Error(`Divisão sem livros: ${division}`);
  }
  return index;
}
