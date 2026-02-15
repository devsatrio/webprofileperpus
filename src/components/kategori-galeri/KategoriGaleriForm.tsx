"use client";
import { useState } from "react";
import { KategoriGaleri } from "@/services/kategoriGaleri";
import useGoBack from "@/hooks/useGoBack";

interface Props {
  initialData?: KategoriGaleri;
  onSubmit: (data: Omit<KategoriGaleri, "id">) => Promise<void>;
}

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function KategoriGaleriForm({ initialData, onSubmit }: Props) {
  const goBack = useGoBack();
  const [form, setForm] = useState({
    nama: initialData?.nama || "",
    slug: initialData?.slug || "",
    is_active: initialData?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };

      // Auto-generate slug from nama
      if (name === "nama" && typeof newValue === "string") {
        updated.slug = generateSlug(newValue);
      }

      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nama.trim()) {
      setError("Nama tidak boleh kosong");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(form);
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

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Nama <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Slug <span className="text-red-500">*</span>
        </label>
        <input
          type="hidden"
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Dihasilkan otomatis dari Nama"
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        />
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-4 h-4"
          />
          <span className="text-gray-700 dark:text-gray-300">Aktif</span>
        </label>
      </div>

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
