"use client";
import { useState, useEffect } from "react";
import { Artikel, ArtikelPayload, artikelService } from "@/services/artikel";
import { KategoriArtikel, kategoriArtikelService } from "@/services/kategoriArtikel";
import { useAuth } from "@/context/AuthContext";
import useGoBack from "@/hooks/useGoBack";
import dynamic from "next/dynamic";

// Dynamic import untuk Quill (SSR tidak support)
const ReactQuill = dynamic(() => import("react-quill-new"), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
});
import "react-quill-new/dist/quill.snow.css";

interface Props {
  initialData?: Artikel;
  onSubmit: (data: ArtikelPayload) => Promise<void>;
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

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image"],
    ["blockquote", "code-block"],
    [{ color: [] }, { background: [] }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "indent",
  "align",
  "link",
  "image",
  "blockquote",
  "code-block",
  "color",
  "background",
];

export default function ArtikelForm({ initialData, onSubmit }: Props) {
  const goBack = useGoBack();
  const { user } = useAuth();
  const [kategoriList, setKategoriList] = useState<KategoriArtikel[]>([]);
  const [loadingKategori, setLoadingKategori] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({
    judul: initialData?.judul || "",
    slug: initialData?.slug || "",
    id_kategori: initialData?.id_kategori || null,
    isi: initialData?.isi || "",
    image: initialData?.image || "",
    created_at: initialData?.created_at || new Date().toISOString().split("T")[0],
    is_active: initialData?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch kategori artikel
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const result = await kategoriArtikelService.getAll();
        // Filter hanya yang aktif
        setKategoriList(result.filter(k => k.is_active));
      } catch (err) {
        console.error("Error fetching kategori:", err);
      } finally {
        setLoadingKategori(false);
      }
    };
    fetchKategori();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === "checkbox" ? checked : value;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: newValue,
      };

      // Auto-generate slug from judul
      if (name === "judul" && typeof newValue === "string") {
        updated.slug = generateSlug(newValue);
      }

      return updated;
    });
  };

  const handleIsiChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      isi: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    // Validate file size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 4MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setForm((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.judul.trim()) {
      setError("Judul tidak boleh kosong");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug tidak boleh kosong");
      return;
    }

    // Validasi gambar mandatory
    if (!imageFile && !form.image) {
      setError("Gambar wajib diisi");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = form.image;

      // Upload image if new file selected
      if (imageFile) {
        setUploadingImage(true);
        
        // Delete old image if exists and this is an edit
        if (initialData?.image) {
          try {
            await artikelService.deleteImage(initialData.image);
          } catch (err) {
            console.error("Error deleting old image:", err);
          }
        }

        imageUrl = await artikelService.uploadImage(imageFile);
        setUploadingImage(false);
      }

      const payload: ArtikelPayload = {
        judul: form.judul,
        slug: form.slug,
        id_kategori: form.id_kategori ? Number(form.id_kategori) : null,
        isi: form.isi || null,
        image: imageUrl || null,
        created_at: form.created_at || null,
        created_by: initialData?.created_by || user?.id || null,
        is_active: form.is_active,
      };

      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Judul */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Judul <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="judul"
          value={form.judul}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Masukkan judul artikel"
        />
      </div>

      {/* Slug (hidden, auto-generated) */}
      <input type="hidden" name="slug" value={form.slug} />

      {/* Kategori */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Kategori
        </label>
        <select
          name="id_kategori"
          value={form.id_kategori || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          disabled={loadingKategori}
        >
          <option value="">-- Pilih Kategori --</option>
          {kategoriList.map((kategori) => (
            <option key={kategori.id} value={kategori.id}>
              {kategori.nama}
            </option>
          ))}
        </select>
      </div>

      {/* Created At */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Tanggal Dibuat
        </label>
        <input
          type="date"
          name="created_at"
          value={form.created_at}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Image */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Gambar <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-3">
          {imagePreview && (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
              >
                ×
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-600 dark:file:text-gray-200"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Format: JPG, PNG, GIF. Maksimal 4MB.
          </p>
        </div>
      </div>

      {/* Isi (HTML Editor) */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Isi Artikel
        </label>
        <div className="bg-white dark:bg-gray-700 rounded-lg">
          <ReactQuill
            theme="snow"
            value={form.isi}
            onChange={handleIsiChange}
            modules={quillModules}
            formats={quillFormats}
            className="h-[1200px] mb-12"
            placeholder="Tulis isi artikel di sini..."
          />
        </div>
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
          disabled={loading || uploadingImage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
        >
          {loading ? (uploadingImage ? "Mengupload gambar..." : "Menyimpan...") : "Simpan"}
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
