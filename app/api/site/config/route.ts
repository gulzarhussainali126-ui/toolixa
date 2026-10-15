import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const defaults = {
  siteName: 'TOOLIXA', tagline: 'One workspace. Infinite utility.', accent: '#9b87ff',
  background: '#08080b', surface: '#121218', radius: 16, font: 'Inter',
  headerText: 'Every tool you need. One beautiful place.', footerText: 'Crafted for a simpler workflow.',
};
const color = (value: unknown, fallback: string) => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
const text = (value: unknown, fallback: string, max = 140) => typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : fallback;
export async function GET() {
  let source: any = {};
  if (process.env.DATABASE_URL) {
    try {
      const row = await prisma.siteSetting.findUnique({ where: { key: 'commandCenter' }, select: { value: true } });
      source = row?.value && typeof row.value === 'object' ? (row.value as any).settings || {} : {};
    } catch { /* Public storefront safely falls back to defaults if DB is unavailable. */ }
  }
  const safe = {
    siteName: text(source.siteName, defaults.siteName, 48),
    tagline: text(source.tagline, defaults.tagline, 120),
    accent: color(source.accent, defaults.accent), background: color(source.background, defaults.background),
    surface: color(source.surface, defaults.surface), radius: typeof source.radius === 'number' ? Math.min(32, Math.max(4, Math.round(source.radius))) : defaults.radius,
    font: ['Inter','System UI','Georgia','Arial','Manrope','DM Sans','Space Grotesk'].includes(source.font) ? source.font : defaults.font,
    headerText: text(source.headerText, defaults.headerText, 100), footerText: text(source.footerText, defaults.footerText, 120),
  };
  return NextResponse.json({ ok: true, config: safe, source: process.env.DATABASE_URL ? 'database-or-defaults' : 'defaults' }, {
    headers: { 'Cache-Control': 'no-store, max-age=0', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' },
  });
}
