import Link from 'next/link';
import { type ReactNode, useCallback, useLayoutEffect, useRef } from 'react';

import {
  describeBook,
  DIVISION_LABELS,
  formatChapters,
  getBookAt,
  TESTAMENT_LABELS,
} from '@/shared/bible';
import { Logo } from '@/shared/components/Logo';

import { playInkReveal } from '../engine/InkReveal';
import {
  coverFrame,
  FULL_SHEET,
  rectCenter,
  SHEET_CLOSE_MS,
  SHEET_EASING,
  SHEET_OPEN_MS,
  type SheetRect,
  sheetTiming,
  TEXT_EASING,
  TEXT_RISE_DELAY_MS,
  TEXT_RISE_MS,
  TEXT_RISE_STAGGER_MS,
} from '../engine/SheetMotion';
import { BookPoster } from './BookPoster';

interface BookSheetProps {
  readonly bookIndex: number | null;
  readonly reducedMotion: boolean;
  readonly getOriginRect: () => DOMRect | null;
  readonly onClosed: () => void;
}

/** Sem capa para medir, a folha nasce de um ponto no centro da tela. */
function resolveOrigin(rect: DOMRect | null): SheetRect {
  return rect ?? { top: window.innerHeight / 2, left: window.innerWidth / 2, width: 0, height: 0 };
}

function SheetLine({ children }: { readonly children: ReactNode }) {
  return (
    <div className="book-sheet-mask" data-sheet-line="">
      <div>{children}</div>
    </div>
  );
}

export function BookSheet({ bookIndex, reducedMotion, getOriginRect, onClosed }: BookSheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inkRef = useRef<SVGGElement>(null);
  const closingRef = useRef(false);

  const book = bookIndex === null ? null : getBookAt(bookIndex);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const ink = inkRef.current;
    if (bookIndex === null || !dialog || !ink) return;

    const origin = resolveOrigin(getOriginRect());
    if (!dialog.open) {
      dialog.showModal();
    }

    dialog.style.transformOrigin = rectCenter(origin);
    dialog.animate(
      [coverFrame(origin, window.innerWidth, window.innerHeight), FULL_SHEET],
      sheetTiming(SHEET_OPEN_MS, SHEET_EASING, reducedMotion),
    );

    dialog.querySelectorAll<HTMLElement>('[data-sheet-line] > *').forEach((line, index) => {
      line.animate(
        [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }],
        sheetTiming(
          TEXT_RISE_MS,
          TEXT_EASING,
          reducedMotion,
          TEXT_RISE_DELAY_MS + index * TEXT_RISE_STAGGER_MS,
        ),
      );
    });

    const stopInk = playInkReveal(Array.from(ink.querySelectorAll('circle')), reducedMotion);

    return () => {
      stopInk();
      for (const animation of dialog.getAnimations({ subtree: true })) {
        animation.cancel();
      }
    };
  }, [bookIndex, getOriginRect, reducedMotion]);

  const requestClose = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open || closingRef.current) return;
    closingRef.current = true;

    const origin = resolveOrigin(getOriginRect());
    dialog.style.transformOrigin = rectCenter(origin);

    const animation = dialog.animate(
      [FULL_SHEET, coverFrame(origin, window.innerWidth, window.innerHeight)],
      sheetTiming(SHEET_CLOSE_MS, SHEET_EASING, reducedMotion),
    );
    animation.onfinish = () => {
      dialog.close();
    };
  }, [getOriginRect, reducedMotion]);

  const handleClose = () => {
    closingRef.current = false;
    onClosed();
  };

  return (
    <dialog
      ref={dialogRef}
      className="book-sheet"
      aria-labelledby="book-sheet-title"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={handleClose}
    >
      {book && (
        <>
          <button type="button" className="book-sheet-close label label-box" onClick={requestClose}>
            Fechar
          </button>

          <div className="book-sheet-logo">
            <Logo />
          </div>

          <div className="book-sheet-body">
            <div className="book-sheet-text">
              <SheetLine>
                <p className="label font-medium text-cobalt">
                  {book.transliteration} / <bdi className="normal-case">{book.originalName}</bdi>
                </p>
              </SheetLine>
              <SheetLine>
                <h2 id="book-sheet-title" className="book-sheet-title">
                  {book.name}
                </h2>
              </SheetLine>
              <SheetLine>
                <p className="label text-muted">
                  {formatChapters(book.chapters)} / {DIVISION_LABELS[book.division]} /{' '}
                  {TESTAMENT_LABELS[book.testament]}
                </p>
              </SheetLine>
              <SheetLine>
                <p className="book-sheet-summary">{describeBook(book)}</p>
              </SheetLine>
              <SheetLine>
                <p className="book-sheet-credit">
                  Autoria segundo a tradição: {book.traditionalAuthor}.
                </p>
              </SheetLine>
              <SheetLine>
                <Link href={`/esbocos/novo?livro=${book.slug}`} className="book-sheet-cta label">
                  Criar esboço
                </Link>
              </SheetLine>
            </div>

            <BookPoster book={book} inkRef={inkRef} />
          </div>
        </>
      )}
    </dialog>
  );
}
