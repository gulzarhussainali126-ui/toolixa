import { NextResponse } from 'next/server';
import { isServerTextOperation, MAX_TEXT_LENGTH, runServerTextOperation } from '../../../../lib/server-text';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 220_000;
function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) return jsonError('Content-Type must be application/json.', 415);
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) return jsonError('Request body is too large.', 413);

  let raw: string;
  try {
    if (!request.body) return jsonError('Request body is required.', 400);
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return jsonError('Request body is too large.', 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    raw = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return jsonError('Request body must be valid UTF-8 JSON.', 400);
  }

  let body: unknown;
  try { body = JSON.parse(raw); } catch { return jsonError('Request body must be valid JSON.', 400); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return jsonError('Request body must be a JSON object.', 400);
  const payload = body as { text?: unknown; operation?: unknown };
  if (typeof payload.text !== 'string' || typeof payload.operation !== 'string') return jsonError('Provide string fields: text and operation.', 400);
  if (payload.text.length > MAX_TEXT_LENGTH) return jsonError(`Text exceeds the ${MAX_TEXT_LENGTH.toLocaleString()} character limit.`, 413);
  if (!isServerTextOperation(payload.operation)) return jsonError('Unknown operation. Check README for supported operations.', 400);

  try {
    const output = runServerTextOperation(payload.text, payload.operation);
    return NextResponse.json({ ok: true, operation: payload.operation, result: output.result, details: output.details ?? null }, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' } });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Processing failed.', 422);
  }
}
