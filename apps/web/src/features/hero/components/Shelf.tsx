import '../styles/Shelf.css';

import { memo, type RefObject } from 'react';

import { SHELF_ITEMS } from '../data/ShelfItems';
import { type ShelfHandlers } from '../hooks/UseShelfEngine';
import { PlayRing } from './PlayRing';
import { Tape } from './Tape';

interface ShelfProps {
  readonly sectionRef: RefObject<HTMLElement | null>;
  readonly stageRef: RefObject<HTMLDivElement | null>;
  readonly probeRef: RefObject<HTMLDivElement | null>;
  readonly playRingRef: RefObject<HTMLButtonElement | null>;
  readonly handlers: ShelfHandlers;
  readonly onPlay: () => void;
}

export const Shelf = memo(function Shelf({
  sectionRef,
  stageRef,
  probeRef,
  playRingRef,
  handlers,
  onPlay,
}: ShelfProps) {
  return (
    <>
      <div ref={probeRef} className="shelf-probe" aria-hidden="true" />
      <section
        ref={sectionRef}
        aria-label="Estante dos livros da Bíblia"
        className="shelf"
        {...handlers}
      >
        <div ref={stageRef} className="shelf-stage" aria-hidden="true">
          {SHELF_ITEMS.map((item) => (
            <Tape key={item.virtualIndex} item={item} />
          ))}
        </div>
        <PlayRing ref={playRingRef} onPlay={onPlay} />
      </section>
    </>
  );
});
