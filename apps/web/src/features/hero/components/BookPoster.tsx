import { type RefObject } from 'react';

import { type BibleBook } from '@/shared/bible';

import { coverTitleScale, wrapCoverTitle } from '../data/CoverTitle';
import { DIVISION_ART } from '../data/DivisionArt';
import { INK_BLOBS } from '../engine/InkReveal';
import { OrnamentShape } from './DivisionOrnament';

const POSTER_WIDTH = 474;
const POSTER_HEIGHT = 900;
const PADDING = 40;
const TITLE_BASE_SIZE = 99;
const TITLE_TOP = 110;
const TITLE_LINE_HEIGHT = 0.95;

interface BookPosterProps {
  readonly book: BibleBook;
  readonly inkRef: RefObject<SVGGElement | null>;
}

export function BookPoster({ book, inkRef }: BookPosterProps) {
  const art = DIVISION_ART[book.division];
  const titleSize = TITLE_BASE_SIZE * coverTitleScale(book.name);
  const titleLines = wrapCoverTitle(book.name);
  const firstBaseline = TITLE_TOP + titleSize * 0.8;
  const lastBaseline = firstBaseline + (titleLines.length - 1) * titleSize * TITLE_LINE_HEIGHT;

  return (
    <svg
      viewBox={`0 0 ${POSTER_WIDTH} ${POSTER_HEIGHT}`}
      className="book-poster"
      aria-hidden="true"
    >
      <defs>
        <filter id="ink-filter" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="3" seed="7" />
          <feDisplacementMap
            in="SourceGraphic"
            scale="120"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <mask id="ink-mask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="874" height="1300">
          <g ref={inkRef} filter="url(#ink-filter)">
            {INK_BLOBS.map((blob) => (
              <circle key={`${blob.cx}-${blob.cy}`} cx={blob.cx} cy={blob.cy} r="0" fill="#fff" />
            ))}
          </g>
        </mask>
        <clipPath id="poster-clip">
          <rect width={POSTER_WIDTH} height={POSTER_HEIGHT} rx="3" />
        </clipPath>
      </defs>

      <g clipPath="url(#poster-clip)" mask="url(#ink-mask)">
        <rect width={POSTER_WIDTH} height={POSTER_HEIGHT} fill={art.background} />

        <text x={PADDING} y="70" className="poster-kicker" fill={art.accent}>
          SYNOPSIS THEOLOGICA
        </text>

        <text
          x={PADDING}
          y={firstBaseline}
          className="poster-title"
          fill={art.ink}
          fontSize={titleSize}
        >
          {titleLines.map((line, index) => (
            <tspan key={line} x={PADDING} dy={index === 0 ? 0 : titleSize * TITLE_LINE_HEIGHT}>
              {line}
            </tspan>
          ))}
        </text>

        <text x={PADDING} y={lastBaseline + 52} className="poster-original" fill={art.accent}>
          {book.originalName}
        </text>
        <text x={PADDING} y={lastBaseline + 88} className="poster-theme" fill={art.ink}>
          {book.theme}
        </text>

        <g
          transform="translate(92 430) scale(2.9)"
          fill="none"
          stroke={art.accent}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <OrnamentShape division={book.division} />
        </g>

        <text x={PADDING} y="850" className="poster-footer" fill={art.ink}>
          {book.chapters} CAP.
        </text>
        <rect
          x="360"
          y="822"
          width="74"
          height="38"
          fill="none"
          stroke={art.ink}
          strokeWidth="1.5"
        />
        <text x="397" y="848" textAnchor="middle" className="poster-footer" fill={art.ink}>
          {book.abbreviation.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}
