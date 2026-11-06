import { describe, expect, it } from 'vitest';

import { coverTitleScale } from './CoverTitle';

describe('coverTitleScale', () => {
  it('usa o tamanho cheio em nomes curtos', () => {
    expect(coverTitleScale('Rute')).toBe(1);
    expect(coverTitleScale('Gênesis')).toBe(1);
  });

  it('reduz na proporção da maior palavra', () => {
    expect(coverTitleScale('Deuteronômio')).toBeCloseTo(7 / 12);
  });

  it('considera só a maior palavra de nomes com espaço', () => {
    expect(coverTitleScale('1 Tessalonicenses')).toBeCloseTo(7 / 15);
  });

  it('nunca passa do tamanho cheio', () => {
    expect(coverTitleScale('')).toBe(1);
  });
});
