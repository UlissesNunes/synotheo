import { assertNever } from '@/shared/lib/AssertNever';

import { type Direction } from '../engine/ShelfEngine';

/** Limite de legendas simultâneas, para giros muito rápidos pela estante. */
export const MAX_CAPTION_ENTRIES = 12;

export interface CaptionEntry {
  readonly id: number;
  readonly bookIndex: number;
  /** Direção de entrada, ou null para a legenda inicial (sem animação). */
  readonly enterDirection: Direction | null;
  /** Direção de saída, ou null enquanto a legenda está ativa. */
  readonly exitDirection: Direction | null;
}

export interface CaptionState {
  readonly activeIndex: number;
  readonly nextId: number;
  readonly entries: readonly CaptionEntry[];
}

export type CaptionAction =
  | { readonly type: 'show'; readonly bookIndex: number; readonly direction: Direction }
  | { readonly type: 'remove'; readonly id: number };

export function createCaptionState(bookIndex: number): CaptionState {
  return {
    activeIndex: bookIndex,
    nextId: 1,
    entries: [{ id: 0, bookIndex, enterDirection: null, exitDirection: null }],
  };
}

export function captionReducer(state: CaptionState, action: CaptionAction): CaptionState {
  switch (action.type) {
    case 'show': {
      if (action.bookIndex === state.activeIndex) return state;

      const leaving = state.entries.map((entry) =>
        entry.exitDirection === null ? { ...entry, exitDirection: action.direction } : entry,
      );
      const entering: CaptionEntry = {
        id: state.nextId,
        bookIndex: action.bookIndex,
        enterDirection: action.direction,
        exitDirection: null,
      };

      return {
        activeIndex: action.bookIndex,
        nextId: state.nextId + 1,
        entries: [...leaving, entering].slice(-MAX_CAPTION_ENTRIES),
      };
    }
    case 'remove':
      return { ...state, entries: state.entries.filter((entry) => entry.id !== action.id) };
    default:
      return assertNever(action);
  }
}
