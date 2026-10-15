import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const gate = await requireAdmin();
  if (gate.response) return gate.response;
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'Database is not configured', code: 'DATABASE_NOT_CONFIGURED' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  try {
    const [toolConfigs, usageEvents, activityEvents, recentActivity, recentUsage] = await Promise.all([
      prisma.toolConfig.count(),
      prisma.usageEvent.count(),
      prisma.activityLog.count(),
      prisma.activityLog.findMany({ take: 20, orderBy: { createdAt: 'desc' }, select: { id: true, actorEmail: true, action: true, entityType: true, entityId: true, createdAt: true } }),
      prisma.usageEvent.findMany({ take: 20, orderBy: { createdAt: 'desc' }, select: { id: true, toolId: true, units: true, status: true, createdAt: true } }),
    ]);
    return NextResponse.json({ ok: true, source: 'postgresql', counts: { toolConfigs, usageEvents, activityEvents }, recentActivity, recentUsage }, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return NextResponse.json({ error: 'Operations data unavailable; apply the Prisma schema and migrations first' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
