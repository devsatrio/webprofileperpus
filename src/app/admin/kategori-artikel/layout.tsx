import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kategori Artikel',
  description: 'Kelola kategori Artikel dan organisir konten visual Anda dengan mudah',
  keywords: 'kategori, Artikel, manajemen, admin',
  openGraph: {
    title: 'Kategori Artikel',
    description: 'Kelola kategori Artikel dan organisir konten visual Anda dengan mudah',
    type: 'website',
  },
};

export default function KategoriArtikelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
