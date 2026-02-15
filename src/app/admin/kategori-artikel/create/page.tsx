"use client";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import KategoriArtikelForm from "@/components/kategori-artikel/kategoriArtikelForm";
import { KategoriArtikel, kategoriArtikelService } from "@/services/kategoriArtikel";

export default function CreatePage() {
  const router = useRouter();

  const handleSubmit = async (formData: Omit<KategoriArtikel, "id">) => {
    try {
      await kategoriArtikelService.create(formData);
      router.push("/admin/kategori-artikel");
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <ComponentCard title="Add Kategori Artikel">
      <div className="space-y-6">
        <KategoriArtikelForm onSubmit={handleSubmit} />
      </div>
    </ComponentCard>
  );
}
