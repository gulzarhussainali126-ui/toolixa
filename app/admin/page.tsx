import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import CommandCenter from './CommandCenter';

export const dynamic = 'force-dynamic';
export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'SUPER_ADMIN') redirect('/admin/login');
  return <CommandCenter />;
}
