"use client";

import { useState } from "react";
import Image from "next/image";
import { LandingLayout } from "@/components/landing";

// Data galeri lengkap (32 item untuk demo pagination)
const allGalleries = [
  { id: 1, image: "/images/grid-image/image-01.png", title: "Project 1", description: "Deskripsi lengkap untuk Project 1. Ini adalah proyek pertama kami yang menampilkan kreativitas dan inovasi." },
  { id: 2, image: "/images/grid-image/image-02.png", title: "Project 2", description: "Deskripsi lengkap untuk Project 2. Proyek ini menggabungkan desain modern dengan fungsionalitas tinggi." },
  { id: 3, image: "/images/grid-image/image-03.png", title: "Project 3", description: "Deskripsi lengkap untuk Project 3. Sebuah karya yang mencerminkan dedikasi tim kami." },
  { id: 4, image: "/images/grid-image/image-04.png", title: "Project 4", description: "Deskripsi lengkap untuk Project 4. Proyek dengan pendekatan minimalis namun impactful." },
  { id: 5, image: "/images/grid-image/image-05.png", title: "Project 5", description: "Deskripsi lengkap untuk Project 5. Menampilkan keahlian kami dalam visual storytelling." },
  { id: 6, image: "/images/grid-image/image-06.png", title: "Project 6", description: "Deskripsi lengkap untuk Project 6. Kolaborasi yang menghasilkan karya luar biasa." },
  { id: 7, image: "/images/grid-image/image-01.png", title: "Project 7", description: "Deskripsi lengkap untuk Project 7. Inovasi tanpa batas dalam setiap detail." },
  { id: 8, image: "/images/grid-image/image-02.png", title: "Project 8", description: "Deskripsi lengkap untuk Project 8. Kualitas premium untuk hasil maksimal." },
  { id: 9, image: "/images/grid-image/image-03.png", title: "Project 9", description: "Deskripsi lengkap untuk Project 9. Kreativitas yang terus berkembang." },
  { id: 10, image: "/images/grid-image/image-04.png", title: "Project 10", description: "Deskripsi lengkap untuk Project 10. Solusi visual yang menarik." },
  { id: 11, image: "/images/grid-image/image-05.png", title: "Project 11", description: "Deskripsi lengkap untuk Project 11. Desain yang berbicara sendiri." },
  { id: 12, image: "/images/grid-image/image-06.png", title: "Project 12", description: "Deskripsi lengkap untuk Project 12. Karya terbaik dari tim profesional." },
  { id: 13, image: "/images/grid-image/image-01.png", title: "Project 13", description: "Deskripsi lengkap untuk Project 13. Pengalaman visual yang mengesankan." },
  { id: 14, image: "/images/grid-image/image-02.png", title: "Project 14", description: "Deskripsi lengkap untuk Project 14. Kombinasi sempurna antara seni dan teknologi." },
  { id: 15, image: "/images/grid-image/image-03.png", title: "Project 15", description: "Deskripsi lengkap untuk Project 15. Hasil kerja keras dan dedikasi." },
  { id: 16, image: "/images/grid-image/image-04.png", title: "Project 16", description: "Deskripsi lengkap untuk Project 16. Proyek yang penuh makna." },
  { id: 17, image: "/images/grid-image/image-05.png", title: "Project 17", description: "Deskripsi lengkap untuk Project 17. Standar tinggi dalam setiap proyek." },
  { id: 18, image: "/images/grid-image/image-06.png", title: "Project 18", description: "Deskripsi lengkap untuk Project 18. Keindahan dalam kesederhanaan." },
  { id: 19, image: "/images/grid-image/image-01.png", title: "Project 19", description: "Deskripsi lengkap untuk Project 19. Inovasi yang menginspirasi." },
  { id: 20, image: "/images/grid-image/image-02.png", title: "Project 20", description: "Deskripsi lengkap untuk Project 20. Karya yang membanggakan." },
  { id: 21, image: "/images/grid-image/image-03.png", title: "Project 21", description: "Deskripsi lengkap untuk Project 21. Eksplorasi tanpa batas." },
  { id: 22, image: "/images/grid-image/image-04.png", title: "Project 22", description: "Deskripsi lengkap untuk Project 22. Visi yang menjadi nyata." },
  { id: 23, image: "/images/grid-image/image-05.png", title: "Project 23", description: "Deskripsi lengkap untuk Project 23. Detail yang sempurna." },
  { id: 24, image: "/images/grid-image/image-06.png", title: "Project 24", description: "Deskripsi lengkap untuk Project 24. Passion dalam setiap pixel." },
  { id: 25, image: "/images/grid-image/image-01.png", title: "Project 25", description: "Deskripsi lengkap untuk Project 25. Kolaborasi yang harmonis." },
  { id: 26, image: "/images/grid-image/image-02.png", title: "Project 26", description: "Deskripsi lengkap untuk Project 26. Kualitas tanpa kompromi." },
  { id: 27, image: "/images/grid-image/image-03.png", title: "Project 27", description: "Deskripsi lengkap untuk Project 27. Kreasi yang autentik." },
  { id: 28, image: "/images/grid-image/image-04.png", title: "Project 28", description: "Deskripsi lengkap untuk Project 28. Estetika yang timeless." },
  { id: 29, image: "/images/grid-image/image-05.png", title: "Project 29", description: "Deskripsi lengkap untuk Project 29. Seni visual modern." },
  { id: 30, image: "/images/grid-image/image-06.png", title: "Project 30", description: "Deskripsi lengkap untuk Project 30. Proyek istimewa kami." },
  { id: 31, image: "/images/grid-image/image-01.png", title: "Project 31", description: "Deskripsi lengkap untuk Project 31. Masterpiece dari tim kami." },
  { id: 32, image: "/images/grid-image/image-02.png", title: "Project 32", description: "Deskripsi lengkap untuk Project 32. Karya penutup yang memukau." },
];

const ITEMS_PER_PAGE = 16;

export default function GaleriPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<typeof allGalleries[0] | null>(null);

  // Pagination logic
  const totalPages = Math.ceil(allGalleries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentGalleries = allGalleries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

      {/* Gallery Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentGalleries.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
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
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-500 transition">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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

          {/* Page Info */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Menampilkan {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, allGalleries.length)} dari {allGalleries.length} item
          </p>
        </div>
      </section>

      {/* Image Modal/Popup */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
              <p className="text-gray-600">{selectedImage.description}</p>
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