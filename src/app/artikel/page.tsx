"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { LandingLayout } from "@/components/landing";

// Data artikel lengkap
const allArticles = [
  {
    id: 1,
    title: "Tips Membangun Website Modern",
    excerpt: "Pelajari cara membangun website yang responsif dan user-friendly dengan teknologi terkini.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "2 Feb 2026",
    category: "Development",
    image: "/images/cards/card-01.png",
    author: "John Doe",
  },
  {
    id: 2,
    title: "Pentingnya UI/UX Design",
    excerpt: "Mengapa desain yang baik sangat penting untuk kesuksesan produk digital Anda.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "1 Feb 2026",
    category: "Design",
    image: "/images/cards/card-02.png",
    author: "Jane Smith",
  },
  {
    id: 3,
    title: "Strategi Digital Marketing",
    excerpt: "Strategi pemasaran digital yang efektif untuk meningkatkan brand awareness.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "30 Jan 2026",
    category: "Marketing",
    image: "/images/cards/card-03.png",
    author: "Mike Johnson",
  },
  {
    id: 4,
    title: "Mengenal React dan Next.js",
    excerpt: "Panduan lengkap untuk memulai development dengan React dan Next.js framework.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "28 Jan 2026",
    category: "Development",
    image: "/images/cards/card-01.png",
    author: "Sarah Williams",
  },
  {
    id: 5,
    title: "Optimasi SEO untuk Website",
    excerpt: "Teknik SEO terbaru untuk meningkatkan ranking website di mesin pencari.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "25 Jan 2026",
    category: "Marketing",
    image: "/images/cards/card-02.png",
    author: "John Doe",
  },
  {
    id: 6,
    title: "Tren Desain Web 2026",
    excerpt: "Eksplorasi tren desain web terbaru yang akan mendominasi tahun ini.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "22 Jan 2026",
    category: "Design",
    image: "/images/cards/card-03.png",
    author: "Jane Smith",
  },
  {
    id: 7,
    title: "Keamanan Website: Best Practices",
    excerpt: "Praktik terbaik untuk menjaga keamanan website dari serangan cyber.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "20 Jan 2026",
    category: "Development",
    image: "/images/cards/card-01.png",
    author: "Mike Johnson",
  },
  {
    id: 8,
    title: "Panduan Tailwind CSS",
    excerpt: "Cara menggunakan Tailwind CSS untuk membangun UI yang modern dan responsif.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "18 Jan 2026",
    category: "Development",
    image: "/images/cards/card-02.png",
    author: "Sarah Williams",
  },
  {
    id: 9,
    title: "Color Theory dalam Design",
    excerpt: "Memahami teori warna dan cara mengaplikasikannya dalam desain digital.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "15 Jan 2026",
    category: "Design",
    image: "/images/cards/card-03.png",
    author: "Jane Smith",
  },
  {
    id: 10,
    title: "Content Marketing Strategy",
    excerpt: "Strategi content marketing yang terbukti efektif untuk bisnis online.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "12 Jan 2026",
    category: "Marketing",
    image: "/images/cards/card-01.png",
    author: "John Doe",
  },
  {
    id: 11,
    title: "TypeScript untuk Pemula",
    excerpt: "Panduan lengkap belajar TypeScript dari dasar hingga mahir.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "10 Jan 2026",
    category: "Development",
    image: "/images/cards/card-02.png",
    author: "Mike Johnson",
  },
  {
    id: 12,
    title: "Responsive Design Principles",
    excerpt: "Prinsip-prinsip desain responsif untuk pengalaman pengguna terbaik.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "8 Jan 2026",
    category: "Design",
    image: "/images/cards/card-03.png",
    author: "Sarah Williams",
  },
  {
    id: 13,
    title: "Social Media Marketing Tips",
    excerpt: "Tips dan trik untuk memaksimalkan marketing melalui social media.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "5 Jan 2026",
    category: "Marketing",
    image: "/images/cards/card-01.png",
    author: "Jane Smith",
  },
  {
    id: 14,
    title: "API Development dengan Node.js",
    excerpt: "Cara membangun RESTful API yang scalable dengan Node.js.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "3 Jan 2026",
    category: "Development",
    image: "/images/cards/card-02.png",
    author: "John Doe",
  },
  {
    id: 15,
    title: "Figma untuk Designer",
    excerpt: "Tutorial lengkap menggunakan Figma untuk UI/UX design.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "1 Jan 2026",
    category: "Design",
    image: "/images/cards/card-03.png",
    author: "Mike Johnson",
  },
  {
    id: 16,
    title: "Email Marketing Effective",
    excerpt: "Cara membuat kampanye email marketing yang efektif dan engaging.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "28 Dec 2025",
    category: "Marketing",
    image: "/images/cards/card-01.png",
    author: "Sarah Williams",
  },
  {
    id: 17,
    title: "Database Design Fundamentals",
    excerpt: "Dasar-dasar desain database untuk aplikasi modern.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "25 Dec 2025",
    category: "Development",
    image: "/images/cards/card-02.png",
    author: "Jane Smith",
  },
  {
    id: 18,
    title: "Animation dalam Web Design",
    excerpt: "Teknik animasi untuk membuat website lebih interaktif dan menarik.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "22 Dec 2025",
    category: "Design",
    image: "/images/cards/card-03.png",
    author: "John Doe",
  },
];

const categories = ["Semua", "Development", "Design", "Marketing"];
const ITEMS_PER_PAGE = 6;

export default function ArtikelPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "Semua" || article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Artikel & Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Temukan insight, tips, dan panduan terbaru dari tim kami seputar development, design, dan digital marketing.
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedCategory === category
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {currentArticles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentArticles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition group"
                  >
                    <Link href={`/artikel/${article.id}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-brand-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span>{article.date}</span>
                          <span className="mx-2">•</span>
                          <span>{article.author}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-500 transition line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                        <div className="mt-4 flex items-center text-brand-500 font-medium text-sm">
                          Baca selengkapnya
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length)} dari {filteredArticles.length} artikel
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Artikel tidak ditemukan</h3>
              <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter kategori</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Semua");
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
