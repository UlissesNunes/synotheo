import { type BookDivision } from '@/shared/bible';
import { assertNever } from '@/shared/lib/AssertNever';

interface DivisionOrnamentProps {
  readonly division: BookDivision;
  readonly className?: string;
}

export function DivisionOrnament({ division, className }: DivisionOrnamentProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <OrnamentShape division={division} />
    </svg>
  );
}

function OrnamentShape({ division }: { readonly division: BookDivision }) {
  switch (division) {
    case 'law':
      // Duas tábuas da lei
      return (
        <>
          <rect x="18" y="20" width="28" height="60" rx="14" />
          <rect x="54" y="20" width="28" height="60" rx="14" />
          <path d="M26 44h12M26 54h12M26 64h12M62 44h12M62 54h12M62 64h12" />
        </>
      );
    case 'history':
      // Muralha com portão
      return (
        <>
          <path d="M18 82V40l16-12 16 12 16-12 16 12v42" />
          <path d="M18 82h64M42 82V62a8 8 0 0 1 16 0v20" />
        </>
      );
    case 'poetry':
      // Lira
      return (
        <>
          <path d="M30 80c-8-30 2-55 20-60 18 5 28 30 20 60" />
          <path d="M30 80h40M40 34v46M50 26v54M60 34v46" />
        </>
      );
    case 'prophets':
      // Sol irradiando: a palavra que ilumina
      return (
        <>
          <circle cx="50" cy="50" r="14" />
          <path d="M50 14v12M50 74v12M14 50h12M74 50h12M25 25l8 8M67 67l8 8M75 25l-8 8M33 67l-8 8" />
        </>
      );
    case 'gospels':
      // Cruz com halo
      return (
        <>
          <circle cx="50" cy="38" r="26" opacity="0.4" />
          <path d="M50 14v72M32 36h36" />
        </>
      );
    case 'letters':
      // Carta selada
      return (
        <>
          <path d="M24 18h42l10 10v54H24z" />
          <path d="M34 38h32M34 48h32M34 58h20" />
          <circle cx="62" cy="70" r="7" />
        </>
      );
    default:
      return assertNever(division);
  }
}
