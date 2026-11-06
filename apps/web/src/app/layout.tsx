import './globals.css';

import { type Metadata, type Viewport } from 'next';
import { type ReactNode } from 'react';

import { PaperGrain } from '@/shared/components/PaperGrain';
import { fontVariables } from '@/shared/fonts/Fonts';

export const metadata: Metadata = {
  title: {
    default: 'SynoTheo',
    template: '%s · SynoTheo',
  },
  description:
    'Synopsis Theologica: crie e organize esboços bíblicos em uma estante 3D com os 66 livros da Bíblia.',
};

export const viewport: Viewport = {
  themeColor: '#edebe6',
};

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={fontVariables}>
      <body suppressHydrationWarning>
        {children}
        <PaperGrain />
      </body>
    </html>
  );
}
