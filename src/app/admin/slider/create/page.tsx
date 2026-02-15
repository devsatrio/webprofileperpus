"use client";
import { useRouter } from "next/navigation";
import { sliderService, Slider } from "@/services/slider";
import SliderForm from "@/components/slider/SliderForm";
import ComponentCard from "@/components/common/ComponentCard";

export default function CreateSliderPage() {
  const router = useRouter();

  const handleSubmit = async (formData: Omit<Slider, "id">, imageFile: File | null) => {
    try {
      // Upload image terlebih dahulu
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await sliderService.uploadImage(imageFile);
      }

      // Simpan data slider
      await sliderService.create({
        ...formData,
        image_url: imageUrl,
      });

      router.push("/admin/slider");
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <ComponentCard title="Tambah Slider">
      <div className="space-y-6">
        <SliderForm onSubmit={handleSubmit} />
      </div>
    </ComponentCard>
  );
}

