import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    name: 'TOOLIXA',
    version: '3.1.0',
    service: 'web-server',
    timestamp: new Date().toISOString(),
    capabilities: ['health-check', 'text-processing-api', 'tool-catalog-api', 'admin-session-protection', 'admin-settings-persistence', 'public-brand-config', 'database-tool-catalog', 'admin-operations-read-api', 'admin-settings-audit-log'],
  }, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' } });
}
