import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tim Kami',
  description: 'Kelola data anggota tim kami',
  keywords: 'tim, team, anggota, admin',
  openGraph: {
    title: 'Tim Kami',
    description: 'Kelola data anggota tim kami',
    type: 'website',
  },
};

export default function TimKamiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
