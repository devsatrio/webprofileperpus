"use client";
import { useState } from "react";
import { OurTeam } from "@/services/ourTeam";
import useGoBack from "@/hooks/useGoBack";
import Image from "next/image";

interface Props {
  initialData?: OurTeam;
  onSubmit: (data: Omit<OurTeam, "id">, imageFile: File | null) => Promise<void>;
}

export default function TimKamiForm({ initialData, onSubmit }: Props) {
  const goBack = useGoBack();
  const [form, setForm] = useState({
    nama: initialData?.nama || "",
    deskripsi: initialData?.deskripsi || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
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

    if (!form.nama.trim()) {
      setError("Nama tidak boleh kosong");
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
          nama: form.nama,
          deskripsi: form.deskripsi,
          image: initialData?.image || "",
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
          Foto {!initialData && <span className="text-red-500">*</span>}
        </label>
        <div className="flex flex-col gap-3">
          {imagePreview && (
            <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
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
            {initialData ? "Biarkan kosong jika tidak ingin mengganti gambar" : "Format: JPG, PNG, WebP. Maksimal 5MB"}
          </p>
        </div>
      </div>

      {/* Nama */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Nama <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder="Masukkan nama anggota tim"
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
          placeholder="Masukkan deskripsi / jabatan (opsional)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
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
