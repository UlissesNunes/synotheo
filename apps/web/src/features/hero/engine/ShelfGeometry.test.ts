import { describe, expect, it } from 'vitest';

import {
  computeTapePose,
  isTapeVisible,
  measureShelf,
  shelfStep,
  smoothstep,
  tapeOffsetX,
  tapeOpenness,
  wrapRelativeIndex,
} from './ShelfGeometry';

const DIMS = measureShelf(900);
const NO_TILT = { x: 0, y: 0 };

describe('smoothstep', () => {
  it('começa em 0, termina em 1 e passa por 0.5 no meio', () => {
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(1)).toBe(1);
    expect(smoothstep(0.5)).toBe(0.5);
  });

  it('limita entradas fora de 0..1', () => {
    expect(smoothstep(-3)).toBe(0);
    expect(smoothstep(7)).toBe(1);
  });
});

describe('shelfStep', () => {
  it('vale 0 no centro e ±0.5 nas pontas', () => {
    expect(shelfStep(0)).toBe(0);
    expect(shelfStep(1)).toBe(0.5);
    expect(shelfStep(-1)).toBe(-0.5);
    expect(shelfStep(5)).toBe(0.5);
  });

  it('é contínuo ao cruzar r = 1', () => {
    expect(shelfStep(0.9999)).toBeCloseTo(0.5, 3);
  });

  it('é simétrico: B(-r) = -B(r)', () => {
    for (const r of [0.1, 0.37, 0.8]) {
      expect(shelfStep(-r)).toBeCloseTo(-shelfStep(r));
    }
  });
});

describe('wrapRelativeIndex', () => {
  it('é zero quando o volume está no centro', () => {
    expect(wrapRelativeIndex(17, 17, 198)).toBe(0);
  });

  it('dá a volta no laço pelo caminho mais curto', () => {
    expect(wrapRelativeIndex(0, 197, 198)).toBe(1);
    expect(wrapRelativeIndex(100, 0, 198)).toBe(-98);
  });

  it('sempre devolve um valor em [-total/2, total/2)', () => {
    for (let virtual = 0; virtual < 198; virtual += 7) {
      const r = wrapRelativeIndex(virtual, 42.6, 198);
      expect(r).toBeGreaterThanOrEqual(-99);
      expect(r).toBeLessThan(99);
    }
  });
});

describe('tapeOffsetX', () => {
  it('coloca o volume central exatamente no meio', () => {
    expect(tapeOffsetX(0, DIMS)).toBe(0);
  });

  it('é simétrico dos dois lados do centro', () => {
    for (const r of [0.4, 1, 3.5]) {
      expect(tapeOffsetX(-r, DIMS)).toBeCloseTo(-tapeOffsetX(r, DIMS));
    }
  });

  it('afasta o vizinho para caber a capa aberta', () => {
    const spineOnly = DIMS.spineWidth + DIMS.gap;
    expect(tapeOffsetX(1, DIMS)).toBeGreaterThan(spineOnly);
  });
});

describe('tapeOpenness', () => {
  it('é 1 no centro e 0 a partir de uma posição de distância', () => {
    expect(tapeOpenness(0)).toBe(1);
    expect(tapeOpenness(1)).toBe(0);
    expect(tapeOpenness(-4)).toBe(0);
  });
});

describe('isTapeVisible', () => {
  it('desenha o centro e descarta o que está longe', () => {
    expect(isTapeVisible(0, 1440, DIMS)).toBe(true);
    expect(isTapeVisible(5000, 1440, DIMS)).toBe(false);
  });
});

describe('computeTapePose', () => {
  it('abre o volume central mostrando a capa', () => {
    const pose = computeTapePose({ relativeIndex: 0, tilt: NO_TILT, lift: 0 }, DIMS);

    expect(pose.rotateY).toBe(-90);
    expect(pose.rotateZ).toBe(-4.5);
    expect(pose.z).toBeCloseTo(0.2 * DIMS.height);
    expect(pose.spineShade).toBeCloseTo(0.55);
    expect(pose.coverShade).toBe(0);
    expect(pose.zIndex).toBe(100);
  });

  it('mantém os distantes como lombada', () => {
    const pose = computeTapePose({ relativeIndex: 3, tilt: NO_TILT, lift: 0 }, DIMS);

    expect(pose.rotateY).toBeCloseTo(0);
    expect(pose.z).toBeCloseTo(0);
    expect(pose.coverShade).toBe(0.5);
    expect(pose.zIndex).toBe(88);
  });

  it('ergue a lombada no hover', () => {
    const resting = computeTapePose({ relativeIndex: 3, tilt: NO_TILT, lift: 0 }, DIMS);
    const lifted = computeTapePose({ relativeIndex: 3, tilt: NO_TILT, lift: 1 }, DIMS);

    expect(lifted.y).toBeLessThan(resting.y);
  });
});
