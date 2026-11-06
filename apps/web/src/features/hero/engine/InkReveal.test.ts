import { describe, expect, it } from 'vitest';

import { inkRadius } from './InkReveal';

describe('inkRadius', () => {
  it('não cresce antes do atraso da mancha', () => {
    expect(inkRadius(-10, 0)).toBe(0);
    expect(inkRadius(100, 120)).toBe(0);
  });

  it('chega ao raio máximo no fim do crescimento', () => {
    expect(inkRadius(1250 + 300, 300)).toBe(720);
  });

  it('já passou da metade na metade do tempo, porque desacelera no fim', () => {
    expect(inkRadius(625, 0)).toBeGreaterThan(360);
  });
});
