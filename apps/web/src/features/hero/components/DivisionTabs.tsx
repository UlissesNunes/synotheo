import { useLayoutEffect, useRef } from 'react';

import { BOOK_DIVISIONS, type BookDivision, DIVISION_LABELS } from '@/shared/bible';

interface DivisionTabsProps {
  readonly activeDivision: BookDivision;
  readonly onSelect: (division: BookDivision) => void;
}

export function DivisionTabs({ activeDivision, onSelect }: DivisionTabsProps) {
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;

    const placeIndicator = () => {
      const tab = nav.querySelector<HTMLElement>(`[data-division="${activeDivision}"]`);
      if (!tab) return;
      indicator.style.width = `${tab.offsetWidth}px`;
      indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
    };

    placeIndicator();
    const frame = requestAnimationFrame(() => {
      indicator.dataset.ready = 'true';
    });
    const observer = new ResizeObserver(placeIndicator);
    observer.observe(nav);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activeDivision]);

  return (
    <nav ref={navRef} aria-label="Divisões da Bíblia" className="hero-tabs">
      <span ref={indicatorRef} className="hero-tabs-indicator" aria-hidden="true" />
      {BOOK_DIVISIONS.map((division) => (
        <button
          key={division}
          type="button"
          data-division={division}
          aria-pressed={division === activeDivision}
          className="hero-tab label"
          onClick={() => {
            onSelect(division);
          }}
        >
          {DIVISION_LABELS[division]}
        </button>
      ))}
    </nav>
  );
}
