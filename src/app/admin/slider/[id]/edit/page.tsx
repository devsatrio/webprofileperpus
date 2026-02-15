"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { sliderService, Slider } from "@/services/slider";
import SliderForm from "@/components/slider/SliderForm";
import ComponentCard from "@/components/common/ComponentCard";

export default function EditSliderPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [data, setData] = useState<Slider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setError("");
        const result = await sliderService.getById(id);
        setData(result);
      } catch (err: any) {
        setError(err.message || "Data tidak ditemukan");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (formData: Omit<Slider, "id">, imageFile: File | null) => {
    try {
      let imageUrl = data?.image_url || "";

      // Upload image baru jika ada
      if (imageFile) {
        // Upload gambar baru
        imageUrl = await sliderService.uploadImage(imageFile);

        // Hapus gambar lama
        if (data?.image_url) {
          await sliderService.deleteImage(data.image_url);
        }
      }

      // Update data slider
      await sliderService.update(id, {
        ...formData,
        image_url: imageUrl,
      });

      router.push("/admin/slider");
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <ComponentCard title="Edit Slider">
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="space-y-4 text-center">
              <div className="inline-block">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 dark:border-gray-600 dark:border-t-blue-400"></div>
              </div>
              <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
            </div>
          </div>
        </div>
      </ComponentCard>
    );
  }

  if (error) {
    return (
      <ComponentCard title="Edit Slider">
        <div className="space-y-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Edit Slider">
      <div className="space-y-6">
        {data && <SliderForm initialData={data} onSubmit={handleSubmit} />}
      </div>
    </ComponentCard>
  );
}
