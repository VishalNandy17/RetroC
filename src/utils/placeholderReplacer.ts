export function replacePlaceholders(template: string, values: Record<string, string>) {
  let result = template;
  for (const [key, val] of Object.entries(values)) {
    const re = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(re, val);
  }
  return result;
}


