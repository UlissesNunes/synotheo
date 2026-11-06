import Link from 'next/link';

import { TOTAL_BOOKS, TOTAL_CHAPTERS } from '@/shared/bible';
import { Logo } from '@/shared/components/Logo';

const CHAPTERS_LABEL = TOTAL_CHAPTERS.toLocaleString('pt-BR');

export function HeroHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 grid h-21 grid-cols-[1fr_auto_1fr] items-center px-8 max-md:h-16 max-md:px-4">
      <Link href="/entrar" className="label label-box justify-self-start">
        Entrar
      </Link>
      <Logo />
      <p className="label justify-self-end max-md:hidden">
        {TOTAL_BOOKS} livros / {CHAPTERS_LABEL} capítulos
      </p>
    </header>
  );
}
