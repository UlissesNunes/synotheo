import { type Direction } from '../engine/ShelfEngine';

interface ShelfArrowsProps {
  readonly onStep: (direction: Direction) => void;
}

const ARROW_PATHS = {
  [-1]: 'M5 1L1 5L5 9M1 5H17',
  [1]: 'M13 1L17 5L13 9M1 5H17',
} as const satisfies Record<Direction, string>;

export function ShelfArrows({ onStep }: ShelfArrowsProps) {
  return (
    <>
      <ArrowButton direction={-1} label="Livro anterior" onStep={onStep} />
      <ArrowButton direction={1} label="Próximo livro" onStep={onStep} />
    </>
  );
}

interface ArrowButtonProps extends ShelfArrowsProps {
  readonly direction: Direction;
  readonly label: string;
}

function ArrowButton({ direction, label, onStep }: ArrowButtonProps) {
  return (
    <button
      type="button"
      className="hero-arrow"
      data-side={direction === -1 ? 'prev' : 'next'}
      aria-label={label}
      onClick={() => {
        onStep(direction);
      }}
    >
      <svg
        width="18"
        height="10"
        viewBox="0 0 18 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden="true"
      >
        <path d={ARROW_PATHS[direction]} />
      </svg>
    </button>
  );
}
