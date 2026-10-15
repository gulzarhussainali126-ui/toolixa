import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'TOOLIXA COMMAND CENTER',
  description: 'TOOLIXA administration and configuration workspace.',
  robots: { index: false, follow: false, nocache: true },
};
export default function AdminLayout({ children }: { children: React.ReactNode }) { return children; }
