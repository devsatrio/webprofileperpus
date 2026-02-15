"use client";
import { useState } from "react";
import { Slider } from "@/services/slider";
import useGoBack from "@/hooks/useGoBack";
import Image from "next/image";

interface Props {
  initialData?: Slider;
  onSubmit: (data: Omit<Slider, "id">, imageFile: File | null) => Promise<void>;
}

export default function SliderForm({ initialData, onSubmit }: Props) {
  const goBack = useGoBack();
  const [form, setForm] = useState({
    heading: initialData?.heading || "",
    sub_heading: initialData?.sub_heading || "",
    deskripsi: initialData?.deskripsi || "",
    link: initialData?.link || "",
    is_active: initialData?.is_active ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi ukuran (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }

      // Validasi tipe file
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar");
        return;
      }

      setError("");
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.heading.trim()) {
      setError("Heading tidak boleh kosong");
      return;
    }

    // Validasi image hanya untuk create (tidak ada initialData)
    if (!initialData && !imageFile) {
      setError("Gambar harus diupload");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(
        {
          heading: form.heading,
          sub_heading: form.sub_heading,
          deskripsi: form.deskripsi,
          link: form.link,
          image_url: initialData?.image_url || "",
          is_active: form.is_active,
        },
        imageFile
      );
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Gambar Slider {!initialData && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-col gap-3">
          {imagePreview && (
            <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {initialData ? "Biarkan kosong jika tidak ingin mengganti gambar" : "Format: JPG, PNG, WebP. Maksimal 5MB. Rekomendasi: 1920x600px"}
          </p>
        </div>
      </div>

      {/* Heading */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Heading <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="heading"
          value={form.heading}
          onChange={handleChange}
          placeholder="Masukkan heading slider"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Sub Heading */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Sub Heading
        </label>
        <input
          type="text"
          name="sub_heading"
          value={form.sub_heading}
          onChange={handleChange}
          placeholder="Masukkan sub heading (opsional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Deskripsi */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Deskripsi
        </label>
        <textarea
          name="deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
          rows={4}
          placeholder="Masukkan deskripsi (opsional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Link */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Link (URL)
        </label>
        <input
          type="url"
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="https://example.com (opsional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Status */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-gray-700 dark:text-gray-300">Aktif (tampilkan di frontend)</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
        <button
          type="button"
          onClick={goBack}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 font-medium transition"
        >
          Kembali
        </button>
      </div>
    </form>
  );
}
