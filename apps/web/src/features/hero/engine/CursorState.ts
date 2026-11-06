export type CursorState = 'default' | 'open';

/** Em ordem de prioridade: a primeira regra que bater vence. */
const CURSOR_RULES: readonly (readonly [Exclude<CursorState, 'default'>, string])[] = [
  ['open', '[data-cursor="open"]'],
];

export function resolveCursorState(target: Element | null): CursorState {
  if (!target) return 'default';

  for (const [state, selector] of CURSOR_RULES) {
    if (target.closest(selector)) return state;
  }
  return 'default';
}
