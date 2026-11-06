import { COVER_LEAN_DEG } from './ShelfGeometry';

export const SHEET_OPEN_MS = 1050;
export const SHEET_CLOSE_MS = 850;
export const SHEET_EASING = 'cubic-bezier(0.76, 0, 0.18, 1)';

export const TEXT_RISE_MS = 900;
export const TEXT_RISE_DELAY_MS = 620;
export const TEXT_RISE_STAGGER_MS = 75;
export const TEXT_EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

export interface SheetRect {
  readonly top: number;
  readonly left: number;
  readonly width: number;
  readonly height: number;
}

/** Folha inteira, reta e sem recorte. */
export const FULL_SHEET: Keyframe = {
  clipPath: 'inset(0px 0px 0px 0px round 0px)',
  transform: 'rotate(0deg)',
};

/** Quadro da folha recortada no tamanho e na inclinação da capa. */
export function coverFrame(
  rect: SheetRect,
  viewportWidth: number,
  viewportHeight: number,
): Keyframe {
  const right = viewportWidth - rect.left - rect.width;
  const bottom = viewportHeight - rect.top - rect.height;

  return {
    clipPath: `inset(${rect.top}px ${right}px ${bottom}px ${rect.left}px round 3px)`,
    transform: `rotate(${COVER_LEAN_DEG}deg)`,
  };
}

/** Centro do retângulo, no formato de transform-origin. */
export function rectCenter(rect: SheetRect): string {
  return `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`;
}

/** Tempo da animação; com movimento reduzido, tudo acontece em 1ms. */
export function sheetTiming(
  duration: number,
  easing: string,
  reducedMotion: boolean,
  delay = 0,
): KeyframeAnimationOptions {
  return reducedMotion ? { duration: 1, fill: 'both' } : { duration, delay, easing, fill: 'both' };
}
