'use client';

import '../styles/HeroChrome.css';

import { useCallback, useState } from 'react';

import { formatChapters, getBookAt, getFirstBookIndex } from '@/shared/bible';
import { usePrefersReducedMotion } from '@/shared/hooks/UsePrefersReducedMotion';

import { useCaptionQueue } from '../hooks/UseCaptionQueue';
import { useShelfEngine } from '../hooks/UseShelfEngine';
import { BookSheet } from './BookSheet';
import { DivisionTabs } from './DivisionTabs';
import { HeroCursor } from './HeroCursor';
import { Shelf } from './Shelf';
import { ShelfArrows } from './ShelfArrows';
import { ShelfCaption } from './ShelfCaption';

const INITIAL_INDEX = 0;

export function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const caption = useCaptionQueue(INITIAL_INDEX);
  const [sheetIndex, setSheetIndex] = useState<number | null>(null);

  const { sectionRef, stageRef, probeRef, playRingRef, handlers, controls } = useShelfEngine({
    initialIndex: INITIAL_INDEX,
    onActiveChange: caption.show,
    onOpenRequest: openSheet,
  });

  function openSheet() {
    if (sheetIndex !== null) return;
    controls.setOpen(true);
    setSheetIndex(caption.activeIndex);
  }

  const handleSheetClosed = useCallback(() => {
    setSheetIndex(null);
    controls.setOpen(false);
  }, [controls]);

  const activeBook = getBookAt(caption.activeIndex);

  return (
    <main className="relative h-svh overflow-hidden select-none">
      <DivisionTabs
        activeDivision={activeBook.division}
        onSelect={(division) => {
          controls.goToIndex(getFirstBookIndex(division));
        }}
      />

      <Shelf
        sectionRef={sectionRef}
        stageRef={stageRef}
        probeRef={probeRef}
        playRingRef={playRingRef}
        handlers={handlers}
        onPlay={controls.open}
      />

      <ShelfCaption
        entries={caption.entries}
        reducedMotion={reducedMotion}
        onExited={caption.remove}
      />

      <ShelfArrows onStep={controls.step} />

      <p className="sr-only" aria-live="polite">
        {activeBook.name}, {formatChapters(activeBook.chapters)}
      </p>

      <HeroCursor />

      <BookSheet
        bookIndex={sheetIndex}
        reducedMotion={reducedMotion}
        getOriginRect={controls.getCoverRect}
        onClosed={handleSheetClosed}
      />
    </main>
  );
}
