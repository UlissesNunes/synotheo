import { type BibleBook } from '@/shared/bible';

import { DivisionOrnament } from './DivisionOrnament';

interface BookSpineProps {
  readonly book: BibleBook;
}

export function BookSpine({ book }: BookSpineProps) {
  return (
    <div className="shelf-spine-art">
      <DivisionOrnament division={book.division} className="shelf-spine-ornament" />
      <span className="shelf-spine-title">{book.name}</span>
      <span className="shelf-spine-badge">{book.abbreviation}</span>
    </div>
  );
}
