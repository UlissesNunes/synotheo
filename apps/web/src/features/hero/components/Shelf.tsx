import '../styles/Shelf.css';

import { memo, type RefObject } from 'react';

import { SHELF_ITEMS } from '../data/ShelfItems';
import { type ShelfHandlers } from '../hooks/UseShelfEngine';
import { Tape } from './Tape';

interface ShelfProps {
  readonly sectionRef: RefObject<HTMLElement | null>;
  readonly stageRef: RefObject<HTMLDivElement | null>;
  readonly probeRef: RefObject<HTMLDivElement | null>;
  readonly handlers: ShelfHandlers;
}

export const Shelf = memo(function Shelf({ sectionRef, stageRef, probeRef, handlers }: ShelfProps) {
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
      </section>
    </>
  );
});
