import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'SUPER_ADMIN') return null;
  return session;
}
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) return { session: null, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } }) };
  return { session, response: null };
}
