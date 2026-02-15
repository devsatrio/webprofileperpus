"use client";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    PencilIcon,
    TrashBinIcon
} from "@/icons/index";
import Badge from "@/components/ui/badge/Badge";
import Link from "next/link";
import { KategoriArtikel, kategoriArtikelService } from "@/services/kategoriArtikel";

export default function KategoriArtikelPage() {
    const [data, setData] = useState<KategoriArtikel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;

    //get data
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");
            const result = await kategoriArtikelService.getAll();
            setData(result);
        } catch (err: any) {
            setError(err.message || "Gagal mengambil data");
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    //delete data
    const handleDelete = async (id: number, nama: string) => {
        Swal.fire({
            title: "Hapus Data?",
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await kategoriArtikelService.delete(id);
                    setData(data.filter((item) => item.id !== id));
                } catch (err: any) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Gagal menghapus: " + (err.message || "Unknown error")
                    });
                    console.error("Error deleting:", err);
                }
            }
        });
    };

    // Filter data berdasarkan search query
    const filteredData = data.filter((item) =>
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Hitung total pages
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Slice data untuk pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Reset ke halaman 1 ketika search berubah
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div>
            <div className="space-y-6">
                <ComponentCard title="Kategori Artikel">
                    <div className="flex flex-col gap-4 mb-5">
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                            <Link href="/admin/kategori-artikel/create">
                                <Button size="sm" variant="primary">
                                    Tambah
                                </Button>
                            </Link>
                            <input
                                type="text"
                                placeholder="Cari nama atau slug..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full sm:w-64"
                            />
                        </div>
                        {filteredData.length > 0 && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data
                            </p>
                        )}
                    </div>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="space-y-4 text-center">
                                    <div className="inline-block">
                                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 dark:border-gray-600 dark:border-t-blue-400"></div>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
                                </div>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <p className="text-gray-500 dark:text-gray-400">Tidak ada data yang cocok</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-full overflow-x-auto">
                                <div className="min-w-[1102px]">
                                    <Table>
                                        {/* Table Header */}
                                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                            <TableRow>
                                                <TableCell
                                                    isHeader
                                                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400 w-12"
                                                >
                                                    No
                                                </TableCell>
                                                <TableCell
                                                    isHeader
                                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    Nama
                                                </TableCell>
                                                <TableCell
                                                    isHeader
                                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    Slug
                                                </TableCell>
                                                <TableCell
                                                    isHeader
                                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                                >
                                                    Status
                                                </TableCell>
                                                <TableCell
                                                    isHeader
                                                    className="px-5 py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
                                                >
                                                    Aksi
                                                </TableCell>
                                            </TableRow>
                                        </TableHeader>

                                        {/* Table Body */}
                                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">

                                            {paginatedData.map((item, key) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center font-medium">
                                                        {startIndex + key + 1}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                        {item.nama}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                        {item.slug}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                                                        <Badge size="sm"
                                                            color={
                                                                item.is_active == true
                                                                    ? "success" : "error"
                                                            }>
                                                            {item.is_active ? "Aktif" : "Nonaktif"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center space-x-1">
                                                        <Link href={`/admin/kategori-artikel/${item.id}/edit`} title="Edit">
                                                            <Button size="sm" variant="success">
                                                                <PencilIcon />
                                                            </Button>
                                                        </Link>
                                                        <Button size="sm" variant="danger" onClick={() => handleDelete(item.id, item.nama)}>
                                                            <TrashBinIcon />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredData.length > 0 && (
                        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/[0.05]">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Halaman {currentPage} dari {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white transition"
                                >
                                    ← Sebelumnya
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 rounded-lg transition ${currentPage === page
                                                ? "bg-blue-600 text-white"
                                                : "border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white transition"
                                >
                                    Selanjutnya →
                                </button>
                            </div>
                        </div>
                    )}
                </ComponentCard>
            </div>
        </div>
    );
}
