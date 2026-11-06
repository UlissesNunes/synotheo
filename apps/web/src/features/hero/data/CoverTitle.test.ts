import { describe, expect, it } from 'vitest';

import { coverTitleScale, wrapCoverTitle } from './CoverTitle';

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

describe('wrapCoverTitle', () => {
  it('mantém em uma linha o que cabe', () => {
    expect(wrapCoverTitle('Gênesis')).toEqual(['Gênesis']);
    expect(wrapCoverTitle('1 Samuel')).toEqual(['1 Samuel']);
  });

  it('quebra nomes compostos longos', () => {
    expect(wrapCoverTitle('2 Coríntios')).toEqual(['2', 'Coríntios']);
    expect(wrapCoverTitle('1 Tessalonicenses')).toEqual(['1', 'Tessalonicenses']);
  });
});
