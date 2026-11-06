import { useEffect, useRef } from 'react';

import { CursorFollower } from '../engine/CursorFollower';

export function HeroCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !window.matchMedia('(pointer: fine)').matches) return;

    const follower = new CursorFollower(element);
    follower.start();

    return () => {
      follower.destroy();
    };
  }, []);

  return (
    <div ref={ref} className="hero-cursor" aria-hidden="true">
      <span className="hero-cursor-disc" />
      <span className="hero-cursor-label">
        <span>Abrir</span>
      </span>
    </div>
  );
}
