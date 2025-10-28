function applyConditionals(template: string, values: Record<string, string>): string {
  // Supports blocks like: /* IF FLAG */ ... /* ENDIF */
  const ifBlock = /\/\*\s*IF\s+([A-Z0-9_]+)\s*\*\/([\s\S]*?)\/\*\s*ENDIF\s*\*\//g;
  return template.replace(ifBlock, (_, flag: string, content: string) => {
    const enabled = String(values[flag] ?? '').toLowerCase() === 'true';
    return enabled ? content : '';
  });
}

export function replacePlaceholders(template: string, values: Record<string, string>) {
  let result = applyConditionals(template, values);
  for (const [key, val] of Object.entries(values)) {
    const re = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(re, val);
  }
  return result;
}


