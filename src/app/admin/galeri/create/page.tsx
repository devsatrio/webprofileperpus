"use client";
import { useRouter } from "next/navigation";
import { Galeri, galeriService } from "@/services/galeri";
import GaleriForm from "@/components/galeri/GaleriForm";
import ComponentCard from "@/components/common/ComponentCard";

export default function CreatePage() {
  const router = useRouter();

  const handleSubmit = async (formData: Omit<Galeri, "id" | "kategori_galeri">) => {
    try {
      await galeriService.create(formData);
      router.push("/admin/galeri");
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <ComponentCard title="Tambah Galeri">
      <div className="space-y-6">
        <GaleriForm onSubmit={handleSubmit} />
      </div>
    </ComponentCard>
  );
}
