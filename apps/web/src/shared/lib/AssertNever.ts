/** Garante, em tempo de compilação, que todos os casos de uma união foram tratados. */
export function assertNever(value: never): never {
  throw new Error(`Caso não tratado: ${String(value)}`);
}
