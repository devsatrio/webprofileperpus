import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galeri',
  description: 'Kelola galeri gambar dan organisir konten visual Anda dengan mudah',
  keywords: 'galeri, gambar, manajemen, admin, foto',
  openGraph: {
    title: 'Galeri',
    description: 'Kelola galeri gambar dan organisir konten visual Anda dengan mudah',
    type: 'website',
  },
};

export default function GaleriLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
