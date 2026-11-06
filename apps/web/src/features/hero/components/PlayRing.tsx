import { type Ref } from 'react';

interface PlayRingProps {
  readonly ref: Ref<HTMLButtonElement>;
  readonly onPlay: () => void;
}

export function PlayRing({ ref, onPlay }: PlayRingProps) {
  return (
    <button ref={ref} type="button" className="hero-play" aria-label="Abrir livro" onClick={onPlay}>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        className="translate-x-//[2px]"
        aria-hidden="true"
      >
        <path d="M2 1L11 6L2 11Z" fill="currentColor" />
      </svg>
    </button>
  );
}
