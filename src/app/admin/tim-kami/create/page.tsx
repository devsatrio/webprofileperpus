"use client";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import TimKamiForm from "@/components/tim-kami/TimKamiForm";
import { OurTeam, ourTeamService } from "@/services/ourTeam";

export default function CreatePage() {
  const router = useRouter();

  const handleSubmit = async (formData: Omit<OurTeam, "id">, imageFile: File | null) => {
    try {
      let imageUrl = "";

      // Upload image jika ada
      if (imageFile) {
        imageUrl = await ourTeamService.uploadImage(imageFile);
      }

      await ourTeamService.create({
        ...formData,
        image: imageUrl,
      });

      router.push("/admin/tim-kami");
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <ComponentCard title="Tambah Tim Kami">
      <div className="space-y-6">
        <TimKamiForm onSubmit={handleSubmit} />
      </div>
    </ComponentCard>
  );
}
