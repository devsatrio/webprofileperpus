"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Artikel, ArtikelPayload, artikelService } from "@/services/artikel";
import ComponentCard from "@/components/common/ComponentCard";
import ArtikelForm from "@/components/artikel/ArtikelForm";

export default function EditArtikelPage() {
    const router = useRouter();
    const params = useParams();
    const id = parseInt(params.id as string);
    const [data, setData] = useState<Artikel | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {
                setError("");
                const result = await artikelService.getById(id);
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

    const handleSubmit = async (formData: ArtikelPayload) => {
        try {
            await artikelService.update(id, formData);
            router.push("/admin/artikel");
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    if (loading) {
        return (
            <ComponentCard title="Edit Artikel">
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
            <ComponentCard title="Edit Artikel">
                <div className="space-y-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
                            <button
                                onClick={() => router.push("/admin/artikel")}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 font-medium transition"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            </ComponentCard>
        );
    }

    return (
        <ComponentCard title="Edit Artikel">
            <div className="space-y-6">
                {data && <ArtikelForm initialData={data} onSubmit={handleSubmit} />}
            </div>
        </ComponentCard>
    );
}
