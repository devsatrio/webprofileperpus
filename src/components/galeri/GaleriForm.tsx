"use client";
import { useState, useEffect, useRef } from "react";
import { Galeri, galeriService } from "@/services/galeri";
import { KategoriGaleri, kategoriGaleriService } from "@/services/kategoriGaleri";
import useGoBack from "@/hooks/useGoBack";
import Image from "next/image";

interface Props {
  initialData?: Galeri;
  onSubmit: (data: Omit<Galeri, "id" | "kategori_galeri">) => Promise<void>;
}

export default function GaleriForm({ initialData, onSubmit }: Props) {
  const goBack = useGoBack();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    keterangan: initialData?.keterangan || "",
    image_url: initialData?.image_url || "",
    id_kategori: initialData?.id_kategori || 0,
    is_active: initialData?.is_active ?? true,
  });
  
  const [kategoriList, setKategoriList] = useState<KategoriGaleri[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingKategori, setLoadingKategori] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);

  // Fetch kategori galeri
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const data = await kategoriGaleriService.getAll();
        // Filter hanya kategori yang aktif
        const activeKategori = data.filter((k) => k.is_active);
        setKategoriList(activeKategori);
      } catch (err: any) {
        console.error("Error fetching kategori:", err);
      } finally {
        setLoadingKategori(false);
      }
    };
    fetchKategori();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: name === "id_kategori" ? parseInt(value) || 0 : newValue,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format file tidak didukung. Gunakan JPEG, PNG, GIF, atau WebP.");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const imageUrl = await galeriService.uploadImage(file);
      setForm((prev) => ({
        ...prev,
        image_url: imageUrl,
      }));
    } catch (err: any) {
      setError(err.message || "Gagal mengupload gambar");
      setImagePreview(initialData?.image_url || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (form.image_url && form.image_url !== initialData?.image_url) {
      try {
        await galeriService.deleteImage(form.image_url);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }
    setForm((prev) => ({
      ...prev,
      image_url: "",
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.keterangan.trim()) {
      setError("Keterangan tidak boleh kosong");
      return;
    }
    if (!form.image_url) {
      setError("Gambar harus diupload");
      return;
    }
    if (!form.id_kategori) {
      setError("Kategori harus dipilih");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        keterangan: form.keterangan,
        image_url: form.image_url,
        id_kategori: form.id_kategori,
        is_active: form.is_active,
      });
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
          Gambar <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-4">
          {imagePreview && (
            <div className="relative w-full max-w-md">
              <Image
                src={imagePreview}
                alt="Preview"
                width={400}
                height={300}
                className="rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                style={{ width: "100%", height: "auto", maxHeight: "300px", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                title="Hapus gambar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-gray-700 dark:file:text-gray-300
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {uploading && (
              <p className="mt-2 text-sm text-blue-500">Mengupload gambar...</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Format: JPEG, PNG, GIF, WebP. Maksimal 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Keterangan */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Keterangan <span className="text-red-500">*</span>
        </label>
        <textarea
          name="keterangan"
          value={form.keterangan}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
          placeholder="Masukkan keterangan gambar..."
        />
      </div>

      {/* Kategori */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Kategori <span className="text-red-500">*</span>
        </label>
        {loadingKategori ? (
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-600 dark:border-gray-600">
            <span className="text-gray-500 dark:text-gray-400">Memuat kategori...</span>
          </div>
        ) : (
          <select
            name="id_kategori"
            value={form.id_kategori}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value={0}>-- Pilih Kategori --</option>
            {kategoriList.map((kategori) => (
              <option key={kategori.id} value={kategori.id}>
                {kategori.nama}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Is Active */}
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

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || uploading}
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
