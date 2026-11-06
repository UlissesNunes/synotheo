import { type BibleBook } from './Bible';
import { BIBLE_BOOKS } from './BibleBooks';
import { DIVISION_LABELS } from './Divisions';

export function formatChapters(count: number): string {
  return count === 1 ? '1 capítulo' : `${count} capítulos`;
}

/** Frase de apresentação do livro, montada só a partir dos dados. */
export function describeBook(book: BibleBook): string {
  const sameDivision = BIBLE_BOOKS.filter((other) => other.division === book.division);
  const position = sameDivision.indexOf(book) + 1;
  const division = DIVISION_LABELS[book.division];

  return (
    `${book.name} é o ${book.order}º livro da Bíblia e o ${position}º de ` +
    `${sameDivision.length} na divisão ${division}. Tema central: ${book.theme}.`
  );
}
