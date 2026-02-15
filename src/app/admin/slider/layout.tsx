import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Slider Banner',
  description: 'Kelola kategori galeri dan organisir konten visual Anda dengan mudah',
  keywords: 'kategori, galeri, manajemen, admin',
  openGraph: {
    title: 'Kategori Galeri',
    description: 'Kelola kategori galeri dan organisir konten visual Anda dengan mudah',
    type: 'website',
  },
};

export default function SliderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
