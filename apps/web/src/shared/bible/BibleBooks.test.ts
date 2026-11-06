import { describe, expect, it } from 'vitest';

import { BOOK_DIVISIONS, LAST_OLD_TESTAMENT_ORDER, TOTAL_BOOKS } from './Bible';
import { BIBLE_BOOKS, TOTAL_CHAPTERS } from './BibleBooks';
import { getBookAt, getFirstBookIndex, isBookSlug } from './BibleQueries';

describe('BIBLE_BOOKS', () => {
  it('tem os 66 livros, 39 no Antigo e 27 no Novo Testamento', () => {
    expect(BIBLE_BOOKS).toHaveLength(TOTAL_BOOKS);
    expect(BIBLE_BOOKS.filter((book) => book.testament === 'old')).toHaveLength(
      LAST_OLD_TESTAMENT_ORDER,
    );
    expect(BIBLE_BOOKS.filter((book) => book.testament === 'new')).toHaveLength(27);
  });

  it('soma os 1.189 capítulos das Bíblias protestantes', () => {
    expect(TOTAL_CHAPTERS).toBe(1189);
  });

  it('tem slugs únicos e reconhecidos pelo type guard', () => {
    const slugs = new Set(BIBLE_BOOKS.map((book) => book.slug));
    expect(slugs.size).toBe(TOTAL_BOOKS);
    for (const book of BIBLE_BOOKS) {
      expect(isBookSlug(book.slug)).toBe(true);
    }
  });

  it('tem a posição canônica igual à ordem da lista', () => {
    BIBLE_BOOKS.forEach((book, index) => {
      expect(book.order).toBe(index + 1);
    });
  });

  it('tem livros em todas as divisões', () => {
    for (const division of BOOK_DIVISIONS) {
      expect(() => getFirstBookIndex(division)).not.toThrow();
    }
  });
});

describe('getBookAt', () => {
  it('lança erro fora do intervalo', () => {
    expect(getBookAt(0).slug).toBe('genesis');
    expect(() => getBookAt(TOTAL_BOOKS)).toThrow(RangeError);
  });
});
