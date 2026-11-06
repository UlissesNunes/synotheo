import { Inter_Tight, Newsreader, Noto_Sans, Noto_Sans_Hebrew } from 'next/font/google';

export const newsreader = Newsreader({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-newsreader',
  display: 'swap',
});

export const interTight = Inter_Tight({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const notoSansHebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  weight: '500',
  variable: '--font-noto-hebrew',
  display: 'swap',
  preload: false,
});

export const notoSansGreek = Noto_Sans({
  subsets: ['greek', 'greek-ext'],
  weight: '500',
  variable: '--font-noto-greek',
  display: 'swap',
  preload: false,
});

export const fontVariables = [newsreader, interTight, notoSansHebrew, notoSansGreek]
  .map((font) => font.variable)
  .join(' ');
