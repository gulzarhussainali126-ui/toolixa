import type { MetadataRoute } from 'next';
import { activeTools, slug, tools } from '../lib/catalog';
import { prisma } from '../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = (process.env.NEXT_PUBLIC_SITE_URL || 'https://toolixaza.com').replace(/\/$/, '');
  const updated = new Date();
  let enabledIds = new Set(activeTools.map((tool) => tool.id));
  if (process.env.DATABASE_URL) {
    try {
      const row = await prisma.siteSetting.findUnique({ where: { key: 'commandCenter' }, select: { value: true } });
      const snapshot = row?.value && typeof row.value === 'object' ? row.value as Record<string, any> : {};
      const overrides = snapshot.toolOverrides;
      if (overrides && typeof overrides === 'object' && !Array.isArray(overrides)) {
        enabledIds = new Set(tools.filter((tool) => tool.live && (typeof overrides[tool.id]?.enabled === 'boolean' ? overrides[tool.id].enabled : tool.live)).map((tool) => tool.id));
      }
    } catch { /* Keep the code-defined sitemap if the database is down. */ }
  }
  return [
    { url: site, lastModified: updated, changeFrequency: 'weekly', priority: 1 },
    ...tools.filter((tool) => enabledIds.has(tool.id)).map((tool) => ({
      url: `${site}/tools/${slug(tool.category)}/${slug(tool.name)}`,
      lastModified: updated,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
