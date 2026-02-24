"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { LandingLayout } from "@/components/landing";
import { galeriService, GaleriWithKategori } from "@/services/galeri";

const ITEMS_PER_PAGE = 12;

export default function GaleriPage() {
  const [galleries, setGalleries] = useState<GaleriWithKategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<GaleriWithKategori | null>(null);
  const [categories, setCategories] = useState<{ id: number; nama: string }[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await galeriService.getAll();

        // Only show active photos with active categories
        const activeGalleries = data.filter(
          (item) => item.is_active && item.kategori_galeri?.is_active
        );
        setGalleries(activeGalleries);

        // Extract unique active categories
        const uniqueCategories = activeGalleries
          .map((item) => item.kategori_galeri)
          .filter((cat, idx, arr) => arr.findIndex((c) => c?.id === cat?.id) === idx)
          .filter((cat) => cat !== undefined) as { id: number; nama: string }[];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to fetch galleries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Filter galleries by selected category
  const filteredGalleries = selectedCategory
    ? galleries.filter((item) => item.id_kategori === selectedCategory)
    : galleries;

  // Pagination logic
  const totalPages = Math.ceil(filteredGalleries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentGalleries = filteredGalleries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Galeri Kami</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Jelajahi koleksi karya dan proyek terbaik kami. Setiap gambar menceritakan kisah unik tentang dedikasi dan kreativitas tim kami.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500"></div>
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada galeri tersedia</p>
            </div>
          ) : (
            <>
              {/* Category Filter Tabs */}
              <div className="mb-8 flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === null
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Semua ({galleries.length})
                </button>
                {categories.map((cat) => {
                  const count = galleries.filter((item) => item.id_kategori === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedCategory === cat.id
                          ? "bg-brand-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat.nama} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Gallery Grid */}
              {currentGalleries.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Belum ada galeri di kategori ini</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {currentGalleries.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedImage(item)}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                          <Image
                            src={item.image_url}
                            alt={item.keterangan}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                            <svg 
                              className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-3">
                          {item.kategori_galeri && (
                            <p className="text-xs text-brand-500 font-medium mb-1">
                              {item.kategori_galeri.nama}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 line-clamp-2">{item.keterangan}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200 hover:border-brand-500 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition ${
                            currentPage === page
                              ? "bg-brand-500 text-white"
                              : "border border-gray-200 hover:border-brand-500 hover:text-brand-500"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200 hover:border-brand-500 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Page Info */}
                  <p className="text-center text-gray-500 text-sm mt-4">
                    Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredGalleries.length)} dari {filteredGalleries.length} item
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Image Modal/Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={selectedImage.image_url}
                alt={selectedImage.keterangan}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedImage.kategori_galeri?.nama || "Galeri"}</h2>
              <p className="text-gray-600">{selectedImage.keterangan}</p>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </LandingLayout>
  );
}