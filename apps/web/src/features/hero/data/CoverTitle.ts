/** Palavras com até este número de letras usam o tamanho cheio do título. */
const MAX_LETTERS_AT_FULL_SIZE = 7;

/** Escala (0 a 1) do título da capa, para a maior palavra sempre caber na largura. */
export function coverTitleScale(title: string): number {
  const longestWord = Math.max(0, ...title.split(' ').map((word) => word.length));
  return Math.min(1, MAX_LETTERS_AT_FULL_SIZE / longestWord);
}
