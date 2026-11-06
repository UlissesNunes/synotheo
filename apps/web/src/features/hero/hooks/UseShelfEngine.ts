import { type DOMAttributes, useEffect, useMemo, useRef } from 'react';

import { TOTAL_BOOKS } from '@/shared/bible';

import { SHELF_COPIES } from '../data/ShelfItems';
import { type Direction, ShelfEngine, type TapeElements } from '../engine/ShelfEngine';
import { measureShelf } from '../engine/ShelfGeometry';

export type ShelfHandlers = Required<
  Pick<
    DOMAttributes<HTMLElement>,
    | 'onPointerDown'
    | 'onPointerMove'
    | 'onPointerUp'
    | 'onPointerCancel'
    | 'onPointerLeave'
    | 'onPointerOver'
    | 'onClick'
    | 'onWheel'
  >
>;

export interface ShelfControls {
  readonly step: (direction: Direction) => void;
  readonly goToIndex: (index: number) => void;
  readonly open: () => void;
}

interface ShelfCallbacks {
  readonly onActiveChange: (index: number, direction: Direction) => void;
  readonly onOpenRequest?: (() => void) | undefined;
}

interface UseShelfEngineOptions extends ShelfCallbacks {
  readonly initialIndex: number;
}

function collectTapes(stage: HTMLElement): TapeElements[] {
  return Array.from(stage.querySelectorAll<HTMLElement>('[data-tape]'), (root) => {
    const spine = root.querySelector<HTMLElement>('[data-face="spine"]');
    const cover = root.querySelector<HTMLElement>('[data-face="cover"]');
    if (!spine || !cover) {
      throw new Error('Volume sem lombada ou capa.');
    }
    return { root, spine, cover };
  });
}

function readVirtualIndex(target: EventTarget): number | null {
  if (!(target instanceof Element)) return null;
  const value = target.closest<HTMLElement>('[data-tape]')?.dataset.virtual;
  return value === undefined ? null : Number(value);
}

export function useShelfEngine({
  initialIndex,
  onActiveChange,
  onOpenRequest,
}: UseShelfEngineOptions) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const playRingRef = useRef<HTMLButtonElement>(null);
  const engineRef = useRef<ShelfEngine | null>(null);
  const suppressClickRef = useRef(false);

  const callbacksRef = useRef<ShelfCallbacks>({ onActiveChange, onOpenRequest });
  useEffect(() => {
    callbacksRef.current = { onActiveChange, onOpenRequest };
  });

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const probe = probeRef.current;
    if (!section || !stage || !probe) return;

    const engine = new ShelfEngine({
      itemCount: TOTAL_BOOKS,
      copies: SHELF_COPIES,
      initialIndex,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      onActiveChange: (index, direction) => {
        callbacksRef.current.onActiveChange(index, direction);
      },
      onOpenRequest: () => {
        callbacksRef.current.onOpenRequest?.();
      },
      onCoverHoverChange: (isOnCover) => {
        if (isOnCover) {
          section.dataset.cursor = 'open';
        } else {
          delete section.dataset.cursor;
        }
      },
    });
    engine.registerTapes(collectTapes(stage));
    engine.registerPlayRing(playRingRef.current);

    const measure = () => {
      const dims = measureShelf(probe.getBoundingClientRect().height);
      section.style.setProperty('--ws', `${dims.spineWidth}px`);
      section.style.setProperty('--d', `${dims.coverWidth}px`);

      const rect = section.getBoundingClientRect();
      engine.setViewport({
        width: window.innerWidth,
        centerY: rect.top + rect.height / 2,
        dims,
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        engine.step(-1);
      } else if (event.key === 'ArrowRight') {
        engine.step(1);
      } else if (event.key === 'Enter' && event.target === document.body) {
        callbacksRef.current.onOpenRequest?.();
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      engine.setPointer(event.clientX, event.clientY);
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointermove', handlePointerMove);

    engine.start();
    requestAnimationFrame(() => {
      stage.dataset.ready = 'true';
    });
    engineRef.current = engine;

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointermove', handlePointerMove);
      engine.destroy();
      engineRef.current = null;
      delete stage.dataset.ready;
      delete section.dataset.cursor;
    };
  }, [initialIndex]);

  const handlers = useMemo<ShelfHandlers>(
    () => ({
      onPointerDown: (event) => {
        engineRef.current?.beginDrag(event.clientX);
      },
      onPointerMove: (event) => {
        engineRef.current?.moveDrag(event.clientX);
      },
      onPointerUp: () => {
        suppressClickRef.current = engineRef.current?.endDrag() ?? false;
      },
      onPointerCancel: () => {
        engineRef.current?.endDrag();
      },
      onPointerLeave: () => {
        engineRef.current?.endDrag();
        engineRef.current?.setHover(null);
      },
      onPointerOver: (event) => {
        engineRef.current?.setHover(readVirtualIndex(event.target));
      },
      onClick: (event) => {
        if (suppressClickRef.current) {
          suppressClickRef.current = false;
          return;
        }
        const virtualIndex = readVirtualIndex(event.target);
        if (virtualIndex !== null) {
          engineRef.current?.selectTape(virtualIndex);
        }
      },
      onWheel: (event) => {
        engineRef.current?.wheel(event.deltaX, event.deltaY);
      },
    }),
    [],
  );

  const controls = useMemo<ShelfControls>(
    () => ({
      step: (direction) => {
        engineRef.current?.step(direction);
      },
      goToIndex: (index) => {
        engineRef.current?.goToIndex(index);
      },
      open: () => {
        callbacksRef.current.onOpenRequest?.();
      },
    }),
    [],
  );

  return { sectionRef, stageRef, probeRef, playRingRef, handlers, controls };
}
