/** Resto sempre positivo: positiveModulo(-1, 66) = 65. */
export function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

/**
 * Aproxima `current` de `target` de forma exponencial e independente da taxa de quadros.
 * `rate` é a "rigidez" da mola: quanto maior, mais rápido chega.
 */
export function approach(current: number, target: number, rate: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-rate * dt));
}

/** Índice do livro (0 a itemCount-1) que está no centro para um dado scroll. */
export function activeIndexFor(scroll: number, itemCount: number): number {
  return positiveModulo(Math.round(scroll), itemCount);
}

/** Alvo de scroll que leva ao livro `index` pelo caminho mais curto do laço. */
export function nearestTarget(currentTarget: number, index: number, itemCount: number): number {
  const base = Math.round(currentTarget);
  const forward = positiveModulo(index - base, itemCount);
  return base + (forward > itemCount / 2 ? forward - itemCount : forward);
}

/**
 * Quantas voltas inteiras descontar do scroll para ele não crescer sem limite.
 * Devolve 0 enquanto o scroll estiver dentro de `maxLoops` voltas.
 */
export function normalizationShift(scroll: number, loopLength: number, maxLoops: number): number {
  if (Math.abs(scroll) <= maxLoops * loopLength) {
    return 0;
  }
  return Math.trunc(scroll / loopLength) * loopLength;
}
