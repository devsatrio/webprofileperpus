"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { KategoriArtikel, kategoriArtikelService } from "@/services/kategoriArtikel";
import ComponentCard from "@/components/common/ComponentCard";
import KategoriArtikelForm from "@/components/kategori-artikel/kategoriArtikelForm";

export default function EditPage() {
    const router = useRouter();
    const params = useParams();
    const id = parseInt(params.id as string);
    const [data, setData] = useState<KategoriArtikel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {
                setError("");
                const result = await kategoriArtikelService.getById(id);
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

    const handleSubmit = async (formData: Omit<KategoriArtikel, "id">) => {
        try {
            await kategoriArtikelService.update(id, formData);
            router.push("/admin/kategori-artikel");
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    if (loading) {
        return (
            <ComponentCard title="Edit Kategori Artikel">
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
            <ComponentCard title="Edit Kategori Artikel">
                <div className="space-y-6">
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                </div>
            </ComponentCard>
        );
    }

    if (!data) return null;

    return (
        <ComponentCard title="Edit Kategori Artikel">
            <div className="space-y-6">
                <KategoriArtikelForm initialData={data} onSubmit={handleSubmit} />
            </div>
        </ComponentCard>
    );
}
