/** Palavras com até este número de letras usam o tamanho cheio do título. */
const MAX_LETTERS_AT_FULL_SIZE = 7;

/** Escala (0 a 1) do título da capa, para a maior palavra sempre caber na largura. */
export function coverTitleScale(title: string): number {
  const longestWord = Math.max(0, ...title.split(' ').map((word) => word.length));
  return Math.min(1, MAX_LETTERS_AT_FULL_SIZE / longestWord);
}

/** Divide o título em linhas que cabem na largura da capa, no tamanho já escalado. */
export function wrapCoverTitle(title: string): string[] {
  const capacity = Math.floor(MAX_LETTERS_AT_FULL_SIZE / coverTitleScale(title)) + 1;
  const lines: string[] = [];

  for (const word of title.split(' ')) {
    const last = lines.at(-1);
    if (last !== undefined && last.length + 1 + word.length <= capacity) {
      lines[lines.length - 1] = `${last} ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines;
}
