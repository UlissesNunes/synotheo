import { type CssVariables } from '@/shared/types/CssVariables';

import { DIVISION_ART } from '../data/DivisionArt';
import { type ShelfItem } from '../data/ShelfItems';
import { BookCover } from './BookCover';
import { BookSpine } from './BookSpine';

interface TapeProps {
  readonly item: ShelfItem;
}

export function Tape({ item }: TapeProps) {
  const art = DIVISION_ART[item.book.division];
  const style: CssVariables = {
    '--art-bg': art.background,
    '--art-ink': art.ink,
    '--art-accent': art.accent,
  };

  return (
    <div className="shelf-tape" data-tape="" data-virtual={item.virtualIndex} style={style}>
      <div className="shelf-face shelf-spine" data-face="spine">
        <BookSpine book={item.book} />
      </div>
      <div className="shelf-face shelf-cover" data-face="cover">
        <BookCover book={item.book} />
      </div>
    </div>
  );
}
