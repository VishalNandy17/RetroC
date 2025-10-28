export function isNonEmpty(value: string | undefined | null): value is string {
  return !!value && value.trim().length > 0;
}

export function isPositiveIntegerString(value: string): boolean {
  return /^[0-9]+$/.test(value) && BigInt(value) > 0n;
}


