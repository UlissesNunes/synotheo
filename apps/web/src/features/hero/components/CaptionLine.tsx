import { type ReactNode } from 'react';

import { type BibleBook, getBookAt } from '@/shared/bible';

import { type CaptionEntry } from '../states/CaptionQueue';
import { CaptionSlide } from './CaptionSlide';

interface CaptionLineProps {
  readonly entries: readonly CaptionEntry[];
  readonly reducedMotion: boolean;
  readonly onExited: (id: number) => void;
  readonly className: string;
  readonly render: (book: BibleBook) => ReactNode;
}

export function CaptionLine({
  entries,
  reducedMotion,
  onExited,
  className,
  render,
}: CaptionLineProps) {
  return (
    <div className={`hero-caption-mask ${className}`}>
      {entries.map((entry) => (
        <CaptionSlide
          key={entry.id}
          entry={entry}
          reducedMotion={reducedMotion}
          onExited={onExited}
        >
          {render(getBookAt(entry.bookIndex))}
        </CaptionSlide>
      ))}
    </div>
  );
}
