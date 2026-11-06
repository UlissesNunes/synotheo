import { type BibleBook } from '@/shared/bible';

import { type CaptionEntry } from '../states/CaptionQueue';
import { CaptionLine } from './CaptionLine';

interface ShelfCaptionProps {
  readonly entries: readonly CaptionEntry[];
  readonly reducedMotion: boolean;
  readonly onExited: (id: number) => void;
}

function renderTitle(book: BibleBook) {
  return book.name;
}

function renderSubtitle(book: BibleBook) {
  return (
    <>
      {book.transliteration} / <bdi className="normal-case">{book.originalName}</bdi>
    </>
  );
}

function renderChapters(book: BibleBook) {
  return `${book.chapters} capítulos`;
}

export function ShelfCaption({ entries, reducedMotion, onExited }: ShelfCaptionProps) {
  const lineProps = { entries, reducedMotion, onExited };

  return (
    <div className="hero-caption" aria-hidden="true">
      <CaptionLine
        {...lineProps}
        className="font-serif text-[31px] leading-[1.12] tracking-[-0.01em] max-md:text-[24px]"
        render={renderTitle}
      />
      <CaptionLine
        {...lineProps}
        className="label font-medium text-cobalt"
        render={renderSubtitle}
      />
      <CaptionLine
        {...lineProps}
        className="text-[11px] font-medium tracking-[0.08em] uppercase"
        render={renderChapters}
      />
    </div>
  );
}
