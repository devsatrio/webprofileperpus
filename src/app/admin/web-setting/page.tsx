"use client";
import { useEffect, useState } from "react";
import { appSettingService, AppSetting } from "@/services/appSetting";
import WebSettingForm from "@/components/web-setting/WebSettingForm";
import ComponentCard from "@/components/common/ComponentCard";

export default function WebSettingPage() {
  const [data, setData] = useState<AppSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await appSettingService.getFirst();
      setData(result);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data pengaturan");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: Partial<Omit<AppSetting, "id">>) => {
    if (!data) return;
    await appSettingService.update(data.id, formData);
    // Refresh data setelah update
    const updated = await appSettingService.getFirst();
    setData(updated);
  };

  if (loading) {
    return (
      <ComponentCard title="Pengaturan Website">
        <div className="flex items-center justify-center py-12">
          <div className="space-y-4 text-center">
            <div className="inline-block">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 dark:border-gray-600 dark:border-t-blue-400"></div>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
          </div>
        </div>
      </ComponentCard>
    );
  }

  if (error) {
    return (
      <ComponentCard title="Pengaturan Website">
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      </ComponentCard>
    );
  }

  if (!data) {
    return (
      <ComponentCard title="Pengaturan Website">
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Data pengaturan tidak ditemukan. Silakan tambahkan data di database terlebih dahulu.
        </div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Pengaturan Website">
      <WebSettingForm initialData={data} onSubmit={handleSubmit} />
    </ComponentCard>
  );
}
