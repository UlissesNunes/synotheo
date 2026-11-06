import { clamp01 } from './ShelfGeometry';

export interface InkBlob {
  readonly cx: number;
  readonly cy: number;
  readonly delayMs: number;
}

/** Sete manchas, em coordenadas do pôster (474 × 900). */
export const INK_BLOBS: readonly InkBlob[] = [
  { cx: 150, cy: 330, delayMs: 0 },
  { cx: 340, cy: 600, delayMs: 120 },
  { cx: 250, cy: 120, delayMs: 220 },
  { cx: 90, cy: 760, delayMs: 300 },
  { cx: 400, cy: 250, delayMs: 360 },
  { cx: 260, cy: 860, delayMs: 420 },
  { cx: 230, cy: 470, delayMs: 180 },
];

const INK_MAX_RADIUS = 720;
const INK_GROW_MS = 1250;
const INK_START_DELAY_MS = 520;
const INK_TOTAL_MS = 2400;
const REDUCED_MOTION_HEAD_START_MS = 5000;

/** Desacelera no fim: rápido no começo, assentando devagar. */
export function easeOutCubic(value: number): number {
  return 1 - (1 - clamp01(value)) ** 3;
}

/** Raio de uma mancha, `elapsedMs` depois do início da tinta. */
export function inkRadius(elapsedMs: number, delayMs: number): number {
  return INK_MAX_RADIUS * easeOutCubic((elapsedMs - delayMs) / INK_GROW_MS);
}

/** Faz as manchas crescerem. Devolve a função que interrompe a animação. */
export function playInkReveal(
  circles: readonly SVGCircleElement[],
  reducedMotion: boolean,
): () => void {
  const startedAt = performance.now() - (reducedMotion ? REDUCED_MOTION_HEAD_START_MS : 0);
  let frameId = 0;

  const draw = (now: number) => {
    const elapsed = now - startedAt;

    circles.forEach((circle, index) => {
      const blob = INK_BLOBS[index];
      if (!blob) return;
      circle.setAttribute('r', String(inkRadius(elapsed - INK_START_DELAY_MS, blob.delayMs)));
    });

    if (elapsed < INK_TOTAL_MS) {
      frameId = requestAnimationFrame(draw);
    }
  };

  for (const circle of circles) {
    circle.setAttribute('r', '0');
  }
  frameId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(frameId);
  };
}
