import { type BibleBook } from '@/shared/bible';
import { type CssVariables } from '@/shared/types/CssVariables';

import { coverTitleScale } from '../data/CoverTitle';
import { DivisionOrnament } from './DivisionOrnament';

interface BookCoverProps {
  readonly book: BibleBook;
}

export function BookCover({ book }: BookCoverProps) {
  const titleStyle: CssVariables = { '--title-scale': String(coverTitleScale(book.name)) };

  return (
    <div className="shelf-cover-art">
      <span className="shelf-cover-kicker">Synopsis Theologica</span>
      <span className="shelf-cover-title" style={titleStyle}>
        {book.name}
      </span>
      <bdi className="shelf-cover-original">{book.originalName}</bdi>
      <span className="shelf-cover-theme">{book.theme}</span>
      <DivisionOrnament division={book.division} className="shelf-cover-ornament" />
      <div className="shelf-cover-footer">
        <span>{book.chapters} cap.</span>
        <span className="shelf-cover-badge">{book.abbreviation}</span>
      </div>
    </div>
  );
}
