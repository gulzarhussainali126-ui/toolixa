import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/admin-auth';

export const dynamic = 'force-dynamic';
const updateSchema = z.object({ settings: z.record(z.string(), z.unknown()) }).strict();
export async function GET() {
  const gate = await requireAdmin(); if (gate.response) return gate.response;
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'Database is not configured', code: 'DATABASE_NOT_CONFIGURED' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  try {
    const rows = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
    return NextResponse.json({ settings: Object.fromEntries(rows.map(row => [row.key, row.value])) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Database unavailable or migrations not applied' }, { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
}
export async function PUT(request: Request) {
  const gate = await requireAdmin(); if (gate.response) return gate.response;
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'Database is not configured', code: 'DATABASE_NOT_CONFIGURED' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  let payload: z.infer<typeof updateSchema>;
  try { payload = updateSchema.parse(await request.json()); } catch { return NextResponse.json({ error: 'Invalid settings payload' }, { status: 400, headers: { 'Cache-Control': 'no-store' } }); }
  if (Object.keys(payload.settings).length > 100) return NextResponse.json({ error: 'Too many settings in one request' }, { status: 413 });
  try {
    const commandCenter = payload.settings.commandCenter as any;
    const sessionUser = gate.session?.user as any;
    const writes: any[] = Object.entries(payload.settings).map(([key, value]) => prisma.siteSetting.upsert({ where: { key }, create: { key, value: value as any, group: 'admin' }, update: { value: value as any, group: 'admin' } }));
    writes.push(prisma.activityLog.create({ data: { actorId: typeof sessionUser?.id === 'string' && sessionUser.id !== 'env-super-admin' ? sessionUser.id : undefined, actorEmail: typeof sessionUser?.email === 'string' ? sessionUser.email.slice(0, 254) : undefined, action: 'admin.settings.saved', entityType: 'SiteSetting', entityId: 'commandCenter', metadata: { keys: Object.keys(payload.settings).slice(0, 100), toolOverrideCount: commandCenter?.toolOverrides && typeof commandCenter.toolOverrides === 'object' ? Object.keys(commandCenter.toolOverrides).length : 0 } } }));
    await prisma.$transaction(writes as any);
    return NextResponse.json({ ok: true, saved: Object.keys(payload.settings).length, auditLogged: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'Could not save settings or audit event; check database migration and JSON values' }, { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
}
