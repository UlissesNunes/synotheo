/** Proporções da caixa, medidas na arte de referência. */
export const SPINE_RATIO = 142 / 840;
export const COVER_RATIO = 474 / 900;
export const GAP_RATIO = 0.03;

/** Inclinação da capa aberta, em graus. A página de detalhe parte do mesmo ângulo. */
export const COVER_LEAN_DEG = -4.5;

const COVER_SPREAD_GAP = 1.6;
const PULL_TOWARDS_VIEWER = 0.2;
const RAISE_WHEN_OPEN = 0.025;
const RAISE_ON_HOVER = 0.045;
const SPINE_MAX_SHADE = 0.55;
const COVER_MAX_SHADE = 0.5;
const CULLING_MARGIN = 1.5;

export interface ShelfDimensions {
  readonly height: number;
  readonly spineWidth: number;
  readonly coverWidth: number;
  readonly gap: number;
}

export interface Tilt {
  readonly x: number;
  readonly y: number;
}

export interface TapePoseInput {
  /** Distância até o centro da estante, em unidades de volume. */
  readonly relativeIndex: number;
  readonly tilt: Tilt;
  /** 0 a 1: quanto o volume está erguido pelo hover. */
  readonly lift: number;
}

export interface TapePose {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotateX: number;
  readonly rotateY: number;
  readonly rotateZ: number;
  readonly zIndex: number;
  readonly spineShade: number;
  readonly coverShade: number;
}

export function measureShelf(height: number): ShelfDimensions {
  return {
    height,
    spineWidth: height * SPINE_RATIO,
    coverWidth: height * COVER_RATIO,
    gap: height * GAP_RATIO,
  };
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Curva em S: começa e termina devagar. Entrada limitada a 0..1. */
export function smoothstep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

/**
 * Degrau suave B(r): vai de -0.5 a +0.5 enquanto r atravessa -1..1.
 * Fora desse intervalo fica parado, e a curva não tem saltos em nenhum ponto.
 */
export function shelfStep(relativeIndex: number): number {
  if (Math.abs(relativeIndex) >= 1) {
    return Math.sign(relativeIndex) * 0.5;
  }
  return (relativeIndex + Math.sin(Math.PI * relativeIndex) / Math.PI) / 2;
}

/**
 * Converte o índice virtual em distância até o centro, dando a volta no laço.
 * O resultado fica sempre em [-total/2, total/2).
 */
export function wrapRelativeIndex(virtualIndex: number, scroll: number, total: number): number {
  const half = total / 2;
  const shifted = (((virtualIndex - scroll + half) % total) + total) % total;
  return shifted - half;
}

/** F(r): posição horizontal do centro do volume. */
export function tapeOffsetX(relativeIndex: number, dims: ShelfDimensions): number {
  const spineStep = relativeIndex * (dims.spineWidth + dims.gap);
  const coverSpread = dims.coverWidth - dims.spineWidth + COVER_SPREAD_GAP * dims.gap;
  return spineStep + coverSpread * shelfStep(relativeIndex);
}

/** 1 para o volume no centro, 0 a partir de uma posição de distância. */
export function tapeOpenness(relativeIndex: number): number {
  return smoothstep(1 - Math.abs(relativeIndex));
}

export function isTapeVisible(x: number, viewportWidth: number, dims: ShelfDimensions): boolean {
  return Math.abs(x) <= viewportWidth / 2 + CULLING_MARGIN * dims.coverWidth;
}

export function computeTapePose(input: TapePoseInput, dims: ShelfDimensions): TapePose {
  const { relativeIndex, tilt, lift } = input;
  const openness = tapeOpenness(relativeIndex);

  return {
    x: tapeOffsetX(relativeIndex, dims),
    y: -openness * RAISE_WHEN_OPEN * dims.height - lift * RAISE_ON_HOVER * dims.height,
    z: openness * PULL_TOWARDS_VIEWER * dims.height,
    rotateX: tilt.x * openness,
    rotateY: -90 * openness + tilt.y * openness,
    rotateZ: COVER_LEAN_DEG * openness,
    zIndex: Math.round(100 - Math.abs(relativeIndex) * 4),
    spineShade: openness * SPINE_MAX_SHADE,
    coverShade: (1 - openness) * COVER_MAX_SHADE,
  };
}
