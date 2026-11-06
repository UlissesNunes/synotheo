import { type CSSProperties } from 'react';

/** Estilo inline que aceita variáveis CSS (--nome) além das propriedades normais. */
export type CssVariables = CSSProperties & Record<`--${string}`, string>;
