"use client";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import ArtikelForm from "@/components/artikel/ArtikelForm";
import { ArtikelPayload, artikelService } from "@/services/artikel";

export default function CreateArtikelPage() {
  const router = useRouter();

  const handleSubmit = async (formData: ArtikelPayload) => {
    try {
      await artikelService.create(formData);
      router.push("/admin/artikel");
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <ComponentCard title="Tambah Artikel">
      <div className="space-y-6">
        <ArtikelForm onSubmit={handleSubmit} />
      </div>
    </ComponentCard>
  );
}
