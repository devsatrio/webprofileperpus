import { Metadata } from "next";
import VisitorTracker from "@/components/visitor/VisitorTracker";

export const metadata: Metadata = {
  title: "Artikel",
  description: "Artikel dan berita terbaru",
};

export default function ArtikelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VisitorTracker />
      {children}
    </>
  );
}
