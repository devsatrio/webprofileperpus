import { Metadata } from "next";
import VisitorTracker from "@/components/visitor/VisitorTracker";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Galeri foto dan dokumentasi kegiatan",
};

export default function GaleriLayout({
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
