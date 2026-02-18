import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Artikel',
  description: 'Kelola artikel dan konten berita dengan mudah',
  keywords: 'artikel, berita, blog, konten, admin',
  openGraph: {
    title: 'Artikel',
    description: 'Kelola artikel dan konten berita dengan mudah',
    type: 'website',
  },
};

export default function ArtikelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
