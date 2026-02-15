"use client";
import { useRouter } from "next/navigation";
import { kategoriGaleriService, KategoriGaleri } from "@/services/kategoriGaleri";
import KategoriGaleriForm from "@/components/kategori-galeri/KategoriGaleriForm";
import ComponentCard from "@/components/common/ComponentCard";

export default function CreatePage() {
  const router = useRouter();

  const handleSubmit = async (formData: Omit<KategoriGaleri, "id">) => {
    try {
      await kategoriGaleriService.create(formData);
      router.push("/admin/kategori-galeri");
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <ComponentCard title="Add Kategori Galeri">
      <div className="space-y-6">
        <KategoriGaleriForm onSubmit={handleSubmit} />
      </div>
    </ComponentCard>
  );
}
