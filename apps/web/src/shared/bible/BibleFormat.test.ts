import { describe, expect, it } from 'vitest';

import { describeBook, formatChapters } from './BibleFormat';
import { getBookBySlug } from './BibleQueries';

describe('formatChapters', () => {
  it('usa o singular para um capítulo', () => {
    expect(formatChapters(1)).toBe('1 capítulo');
  });

  it('usa o plural para mais de um', () => {
    expect(formatChapters(50)).toBe('50 capítulos');
  });
});

describe('describeBook', () => {
  it('apresenta Gênesis como o primeiro da Lei', () => {
    expect(describeBook(getBookBySlug('genesis'))).toBe(
      'Gênesis é o 1º livro da Bíblia e o 1º de 5 na divisão Lei. Tema central: Origens e promessa.',
    );
  });

  it('conta Atos junto com os livros históricos do Antigo Testamento', () => {
    expect(describeBook(getBookBySlug('atos'))).toContain('o 44º livro da Bíblia e o 13º de 13');
  });
});
