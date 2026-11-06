import { describe, expect, it } from 'vitest';

import {
  activeIndexFor,
  approach,
  nearestTarget,
  normalizationShift,
  positiveModulo,
  settleProgress,
} from './ShelfNavigation';

const BOOKS = 66;

describe('positiveModulo', () => {
  it('nunca devolve negativo', () => {
    expect(positiveModulo(5, 3)).toBe(2);
    expect(positiveModulo(-5, 3)).toBe(1);
    expect(positiveModulo(-1, BOOKS)).toBe(65);
  });
});

describe('approach', () => {
  it('não se move sem tempo passado', () => {
    expect(approach(0, 10, 5, 0)).toBe(0);
  });

  it('chega ao alvo com tempo suficiente', () => {
    expect(approach(0, 10, 5, 10)).toBeCloseTo(10);
  });

  it('percorre metade do caminho em ln(2)/rate segundos', () => {
    expect(approach(0, 10, 1, Math.LN2)).toBeCloseTo(5);
  });

  it('é independente da taxa de quadros', () => {
    const twoSmallFrames = approach(approach(0, 10, 5, 0.01), 10, 5, 0.01);
    const oneBigFrame = approach(0, 10, 5, 0.02);
    expect(twoSmallFrames).toBeCloseTo(oneBigFrame, 10);
  });
});

describe('activeIndexFor', () => {
  it('arredonda o scroll e dá a volta no laço', () => {
    expect(activeIndexFor(66, BOOKS)).toBe(0);
    expect(activeIndexFor(67.6, BOOKS)).toBe(2);
    expect(activeIndexFor(-1, BOOKS)).toBe(65);
  });
});

describe('nearestTarget', () => {
  it('vai de Gênesis para Apocalipse dando um passo para trás', () => {
    expect(nearestTarget(66, 65, BOOKS)).toBe(65);
  });

  it('vai para o vizinho da frente com um passo', () => {
    expect(nearestTarget(66, 1, BOOKS)).toBe(67);
  });

  it('escolhe o lado mais curto do laço', () => {
    expect(nearestTarget(66, 34, BOOKS)).toBe(34);
    expect(nearestTarget(66, 33, BOOKS)).toBe(99);
  });

  it('sempre leva ao livro pedido', () => {
    for (let index = 0; index < BOOKS; index += 5) {
      expect(activeIndexFor(nearestTarget(66.4, index, BOOKS), BOOKS)).toBe(index);
    }
  });
});

describe('normalizationShift', () => {
  it('não mexe enquanto o scroll é pequeno', () => {
    expect(normalizationShift(500, 198, 4)).toBe(0);
  });

  it('desconta voltas inteiras quando o scroll cresce demais', () => {
    expect(normalizationShift(1000, 198, 4)).toBe(990);
    expect(normalizationShift(-1000, 198, 4)).toBe(-990);
  });
});

describe('settleProgress', () => {
  it('é 1 com a estante parada', () => {
    expect(settleProgress(17, 17)).toBe(1);
  });

  it('é 0 a partir de um terço de volume do alvo', () => {
    expect(settleProgress(17, 17.34)).toBe(0);
    expect(settleProgress(17, 14)).toBe(0);
  });

  it('cresce conforme a estante se aproxima do alvo', () => {
    expect(settleProgress(17, 17.1)).toBeGreaterThan(settleProgress(17, 17.2));
  });
});
