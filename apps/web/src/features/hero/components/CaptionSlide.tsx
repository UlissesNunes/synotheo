import { type ReactNode, useLayoutEffect, useRef } from 'react';

import { type CaptionEntry } from '../states/CaptionQueue';

const SLIDE_DURATION_MS = 650;
const SLIDE_EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const SLIDE_OFFSET_PERCENT = 105;

interface CaptionSlideProps {
  readonly entry: CaptionEntry;
  readonly reducedMotion: boolean;
  readonly onExited: (id: number) => void;
  readonly children: ReactNode;
}

export function CaptionSlide({ entry, reducedMotion, onExited, children }: CaptionSlideProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { id, enterDirection, exitDirection } = entry;

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || enterDirection === null || reducedMotion) return;

    const animation = element.animate(
      [
        { transform: `translateY(${enterDirection * SLIDE_OFFSET_PERCENT}%)` },
        { transform: 'translateY(0)' },
      ],
      { duration: SLIDE_DURATION_MS, easing: SLIDE_EASING, fill: 'both' },
    );

    return () => {
      animation.cancel();
    };
  }, [enterDirection, reducedMotion]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element || exitDirection === null) return;

    if (reducedMotion) {
      onExited(id);
      return;
    }

    const currentTransform = getComputedStyle(element).transform;
    for (const running of element.getAnimations()) {
      running.cancel();
    }

    const animation = element.animate(
      [
        { transform: currentTransform === 'none' ? 'translateY(0)' : currentTransform },
        { transform: `translateY(${-exitDirection * SLIDE_OFFSET_PERCENT}%)` },
      ],
      { duration: SLIDE_DURATION_MS, easing: SLIDE_EASING, fill: 'both' },
    );
    animation.onfinish = () => {
      onExited(id);
    };

    return () => {
      animation.onfinish = null;
      animation.cancel();
    };
  }, [exitDirection, id, onExited, reducedMotion]);

  return <span ref={ref}>{children}</span>;
}
