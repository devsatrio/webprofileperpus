"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { LandingLayout } from "@/components/landing";
import { artikelService, Artikel } from "@/services/artikel";
import { kategoriArtikelService, KategoriArtikel } from "@/services/kategoriArtikel";

const ITEMS_PER_PAGE = 6;

// Helper function to strip HTML and clean text for excerpt
const stripHtmlAndClean = (html: string, maxLength: number = 150): string => {
  if (!html) return "";
  
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, " ");
  
  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&hellip;/gi, "...")
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&rdquo;/gi, '"')
    .replace(/&ldquo;/gi, '"')
    .replace(/&#\d+;/g, ""); // Remove remaining numeric entities
  
  // Clean up whitespace
  text = text.replace(/\s+/g, " ").trim();
  
  // Truncate to maxLength
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim();
    // Don't cut in the middle of a word
    const lastSpace = text.lastIndexOf(" ");
    if (lastSpace > maxLength - 30) {
      text = text.substring(0, lastSpace);
    }
    text += "...";
  }
  
  return text;
};

export default function ArtikelPage() {
  const [allArticles, setAllArticles] = useState<Artikel[]>([]);
  const [categories, setCategories] = useState<KategoriArtikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch articles and categories from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, categoriesData] = await Promise.all([
          artikelService.getActive(),
          kategoriArtikelService.getAll(),
        ]);
        setAllArticles(articlesData);
        setCategories(categoriesData.filter((c) => c.is_active));
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesSearch =
        article.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.isi &&
          article.isi
            .replace(/<[^>]*>/g, "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === null || article.id_kategori === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allArticles, searchQuery, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Reset page when filter changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Artikel & Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan insight, tips, dan panduan terbaru dari tim kami seputar
            development, design, dan digital marketing.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === null
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Semua
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category.id
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.nama}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500"></div>
            </div>
          ) : currentArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition group"
                  >
                    <Link href={`/artikel/${article.slug || article.id}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.image || "/images/cards/card-01.png"}
                          alt={article.judul}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {article.kategori_artikel && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-brand-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                              {article.kategori_artikel.nama}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span>
                            {article.created_at
                              ? new Date(article.created_at).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )
                              : "-"}
                          </span>
                          {article.created_by && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{article.created_by}</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-500 transition line-clamp-2">
                          {article.judul}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {stripHtmlAndClean(article.isi || "", 150)}
                        </p>
                        <div className="mt-4 flex items-center text-brand-500 font-medium text-sm">
                          Baca selengkapnya
                          <svg
                            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </article>
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
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
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
                    )
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 hover:border-brand-500 hover:text-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {/* Page Info */}
              <p className="text-center text-gray-500 text-sm mt-4">
                Menampilkan {startIndex + 1} -{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length)}{" "}
                dari {filteredArticles.length} artikel
              </p>
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Artikel tidak ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="mt-4 text-brand-500 font-medium hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>
    </LandingLayout>
  );
}
