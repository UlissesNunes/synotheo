import { describe, expect, it } from 'vitest';

import { coverFrame, rectCenter } from './SheetMotion';

const COVER = { top: 100, left: 200, width: 300, height: 500 };

describe('coverFrame', () => {
  it('recorta a folha exatamente sobre a capa, com a inclinação dela', () => {
    expect(coverFrame(COVER, 1000, 800)).toEqual({
      clipPath: 'inset(100px 500px 200px 200px round 3px)',
      transform: 'rotate(-4.5deg)',
    });
  });
});

describe('rectCenter', () => {
  it('devolve o centro do retângulo', () => {
    expect(rectCenter(COVER)).toBe('350px 350px');
  });
});
