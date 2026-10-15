export const MAX_TEXT_LENGTH = 200_000;

export const serverTextOperations = [
  'uppercase', 'lowercase', 'titlecase', 'reverse', 'trim',
  'remove-extra-spaces', 'remove-duplicate-lines', 'sort-lines',
  'word-count', 'character-count', 'line-count', 'slug',
  'url-encode', 'url-decode', 'base64-encode', 'base64-decode',
] as const;

export type ServerTextOperation = typeof serverTextOperations[number];

export function isServerTextOperation(value: string): value is ServerTextOperation {
  return (serverTextOperations as readonly string[]).includes(value);
}

export function runServerTextOperation(text: string, operation: ServerTextOperation): { result: string; details?: Record<string, number> } {
  switch (operation) {
    case 'uppercase': return { result: text.toLocaleUpperCase() };
    case 'lowercase': return { result: text.toLocaleLowerCase() };
    case 'titlecase': return { result: text.toLocaleLowerCase().replace(/(^|\s)\S/g, c => c.toLocaleUpperCase()) };
    case 'reverse': return { result: Array.from(text).reverse().join('') };
    case 'trim': return { result: text.trim() };
    case 'remove-extra-spaces': return { result: text.replace(/[\t ]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim() };
    case 'remove-duplicate-lines': return { result: [...new Set(text.split(/\r?\n/))].join('\n') };
    case 'sort-lines': return { result: text.split(/\r?\n/).sort((a, b) => a.localeCompare(b)) .join('\n') };
    case 'word-count': {
      const words = (text.trim().match(/\S+/g) || []).length;
      return { result: String(words), details: { words, characters: Array.from(text).length } };
    }
    case 'character-count': return { result: String(Array.from(text).length), details: { characters: Array.from(text).length, charactersWithoutSpaces: Array.from(text.replace(/\s/g, '')).length } };
    case 'line-count': {
      const lines = text.length ? text.split(/\r?\n/).length : 0;
      return { result: String(lines), details: { lines } };
    }
    case 'slug': return { result: text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') };
    case 'url-encode': return { result: encodeURIComponent(text) };
    case 'url-decode': try { return { result: decodeURIComponent(text) }; } catch { throw new Error('Input is not valid URL-encoded text.'); }
    case 'base64-encode': return { result: Buffer.from(text, 'utf8').toString('base64') };
    case 'base64-decode': {
      const normalized = text.replace(/\s+/g, '');
      if (normalized.length % 4 === 1 || !/^(?:[A-Za-z0-9+/]*={0,2})$/.test(normalized) || /=/.test(normalized.slice(0, -2))) {
        throw new Error('Input is not valid Base64.');
      }
      const decoded = Buffer.from(normalized, 'base64');
      if (decoded.toString('base64').replace(/=+$/, '') !== normalized.replace(/=+$/, '')) throw new Error('Input is not valid Base64.');
      return { result: decoded.toString('utf8') };
    }
  }
}
