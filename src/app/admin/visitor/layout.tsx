import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visitor Statistics",
  description: "Monitor statistik pengunjung website",
};

export default function VisitorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
