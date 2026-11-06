import { useCallback, useReducer } from 'react';

import { type Direction } from '../engine/ShelfEngine';
import { captionReducer, createCaptionState } from '../states/CaptionQueue';

export function useCaptionQueue(initialIndex: number) {
  const [state, dispatch] = useReducer(captionReducer, initialIndex, createCaptionState);

  const show = useCallback((bookIndex: number, direction: Direction) => {
    dispatch({ type: 'show', bookIndex, direction });
  }, []);

  const remove = useCallback((id: number) => {
    dispatch({ type: 'remove', id });
  }, []);

  return { activeIndex: state.activeIndex, entries: state.entries, show, remove };
}
