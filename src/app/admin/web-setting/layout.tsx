import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pengaturan Website',
  description: 'Kelola pengaturan website seperti nama program, kontak, dan media sosial',
  keywords: 'pengaturan, setting, website, admin',
  openGraph: {
    title: 'Pengaturan Website',
    description: 'Kelola pengaturan website seperti nama program, kontak, dan media sosial',
    type: 'website',
  },
};

export default function WebSettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
