export function info(message: string) {
  // eslint-disable-next-line no-console
  console.log(`[RetroC] ${message}`);
}

export function error(message: string, err?: unknown) {
  // eslint-disable-next-line no-console
  console.error(`[RetroC] ${message}`, err);
}


