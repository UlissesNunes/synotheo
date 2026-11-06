import { describe, expect, it } from 'vitest';

import { captionReducer, createCaptionState, MAX_CAPTION_ENTRIES } from './CaptionQueue';

describe('captionReducer', () => {
  it('começa com uma legenda parada, sem animação', () => {
    const state = createCaptionState(5);

    expect(state.activeIndex).toBe(5);
    expect(state.entries).toEqual([
      { id: 0, bookIndex: 5, enterDirection: null, exitDirection: null },
    ]);
  });

  it('faz a nova legenda entrar e a anterior sair na mesma direção', () => {
    const state = captionReducer(createCaptionState(0), {
      type: 'show',
      bookIndex: 1,
      direction: 1,
    });

    expect(state.activeIndex).toBe(1);
    expect(state.entries).toEqual([
      { id: 0, bookIndex: 0, enterDirection: null, exitDirection: 1 },
      { id: 1, bookIndex: 1, enterDirection: 1, exitDirection: null },
    ]);
  });

  it('ignora o mesmo livro', () => {
    const initial = createCaptionState(3);
    expect(captionReducer(initial, { type: 'show', bookIndex: 3, direction: 1 })).toBe(initial);
  });

  it('não muda a direção de quem já está saindo', () => {
    let state = createCaptionState(0);
    state = captionReducer(state, { type: 'show', bookIndex: 1, direction: 1 });
    state = captionReducer(state, { type: 'show', bookIndex: 0, direction: -1 });

    expect(state.entries.map((entry) => entry.exitDirection)).toEqual([1, -1, null]);
  });

  it('remove a legenda pelo id', () => {
    let state = captionReducer(createCaptionState(0), {
      type: 'show',
      bookIndex: 1,
      direction: 1,
    });
    state = captionReducer(state, { type: 'remove', id: 0 });

    expect(state.entries.map((entry) => entry.id)).toEqual([1]);
  });

  it('limita as legendas simultâneas e mantém a ativa por último', () => {
    let state = createCaptionState(0);
    for (let index = 1; index <= 30; index++) {
      state = captionReducer(state, { type: 'show', bookIndex: index, direction: 1 });
    }

    expect(state.entries).toHaveLength(MAX_CAPTION_ENTRIES);
    expect(state.entries.at(-1)?.bookIndex).toBe(30);
  });
});
