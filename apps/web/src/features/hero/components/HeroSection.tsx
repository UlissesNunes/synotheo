'use client';

import '../styles/HeroChrome.css';

import { getBookAt, getFirstBookIndex } from '@/shared/bible';
import { usePrefersReducedMotion } from '@/shared/hooks/UsePrefersReducedMotion';

import { useCaptionQueue } from '../hooks/UseCaptionQueue';
import { useShelfEngine } from '../hooks/UseShelfEngine';
import { DivisionTabs } from './DivisionTabs';
import { HeroCursor } from './HeroCursor';
import { Shelf } from './Shelf';
import { ShelfArrows } from './ShelfArrows';
import { ShelfCaption } from './ShelfCaption';

const INITIAL_INDEX = 0;

export function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const caption = useCaptionQueue(INITIAL_INDEX);

  const { sectionRef, stageRef, probeRef, playRingRef, handlers, controls } = useShelfEngine({
    initialIndex: INITIAL_INDEX,
    onActiveChange: caption.show,
  });

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
        {activeBook.name}, {activeBook.chapters} capítulos
      </p>

      <HeroCursor />
    </main>
  );
}
