import { NextResponse } from 'next/server';
import { activeTools, categoryNames, tools } from '../../../../lib/catalog';
import { prisma } from '../../../../lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  let overrides: Record<string, any> = {};
  let source: 'static-defaults' | 'database' = 'static-defaults';
  if (process.env.DATABASE_URL) {
    try {
      const row = await prisma.siteSetting.findUnique({ where: { key: 'commandCenter' }, select: { value: true } });
      const value = row?.value && typeof row.value === 'object' ? row.value as Record<string, any> : {};
      const candidate = value.toolOverrides;
      if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
        overrides = candidate;
        source = 'database';
      }
    } catch { /* A database outage must not take down the public catalog. */ }
  }
  const publicTools = tools.map((tool) => {
    const override = overrides[tool.id];
    const name = typeof override?.name === 'string' && override.name.trim() ? override.name.trim().slice(0, 100) : tool.name;
    const description = typeof override?.description === 'string' && override.description.trim() ? override.description.trim().slice(0, 500) : tool.description;
    // Planned concepts can never be made executable by changing a dashboard toggle.
    const live = tool.live && (typeof override?.enabled === 'boolean' ? override.enabled : tool.live);
    return { id: tool.id, name, category: tool.category, description, live, kind: tool.kind };
  });
  const readyTools = publicTools.filter((tool) => tool.live);
  const categories = categoryNames.map((name) => ({ name, catalogCount: publicTools.filter((tool) => tool.category === name).length, readyCount: readyTools.filter((tool) => tool.category === name).length }));
  return NextResponse.json({
    ok: true, name: 'TOOLIXA', version: '3.1.0', source,
    summary: { categories: categoryNames.length, catalogConcepts: publicTools.length, readyMarked: readyTools.length, planned: publicTools.length - readyTools.length },
    note: 'Ready-marked means a local implementation path exists; it is not a claim of external production certification.',
    categories, readyTools,
  }, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' } });
}
