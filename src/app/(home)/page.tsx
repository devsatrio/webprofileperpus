"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LandingLayout } from "@/components/landing";
import { galeriService, Galeri } from "@/services/galeri";
import { sliderService, Slider } from "@/services/slider";

// Data slider akan diambil dari database

// Data galeri akan diambil dari database

// Data artikel
const articles = [
  {
    id: 1,
    title: "Tips Membangun Website Modern",
    excerpt: "Pelajari cara membangun website yang responsif dan user-friendly dengan teknologi terkini.",
    date: "2 Feb 2026",
    image: "/images/cards/card-01.png",
  },
  {
    id: 2,
    title: "Pentingnya UI/UX Design",
    excerpt: "Mengapa desain yang baik sangat penting untuk kesuksesan produk digital Anda.",
    date: "1 Feb 2026",
    image: "/images/cards/card-02.png",
  },
  {
    id: 3,
    title: "Strategi Digital Marketing",
    excerpt: "Strategi pemasaran digital yang efektif untuk meningkatkan brand awareness.",
    date: "30 Jan 2026",
    image: "/images/cards/card-03.png",
  },
];

// Data team
const teams = [
  {
    id: 1,
    name: "John Doe",
    role: "CEO & Founder",
    image: "/images/user/user-01.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "CTO",
    image: "/images/user/user-02.jpg",
  },
  {
    id: 3,
    name: "Mike Johnson",
    role: "Lead Designer",
    image: "/images/user/user-03.jpg",
  },
  {
    id: 4,
    name: "Sarah Williams",
    role: "Project Manager",
    image: "/images/user/user-04.jpg",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slider[]>([]);
  const [loadingSlider, setLoadingSlider] = useState(true);
  const [galleries, setGalleries] = useState<Galeri[]>([]);
  const [selectedImage, setSelectedImage] = useState<Galeri | null>(null);
  const [loadingGallery, setLoadingGallery] = useState(true);

  // Fetch slider data from Supabase
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const data = await sliderService.getActive();
        setSlides(data);
      } catch (err) {
        console.error("Error fetching sliders:", err);
      } finally {
        setLoadingSlider(false);
      }
    };
    fetchSliders();
  }, []);

  // Fetch gallery data from Supabase
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        // Ambil 6 galeri terbaru yang aktif
        const data = await galeriService.getLatest(6);
        setGalleries(data);
      } catch (err) {
        console.error("Error fetching galleries:", err);
      } finally {
        setLoadingGallery(false);
      }
    };
    fetchGalleries();
  }, []);

  // Auto slide
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <LandingLayout>
      {/* Hero Slider */}
      <section id="home" className="pt-16 relative h-screen overflow-hidden bg-gray-50">
        {loadingSlider ? (
          <div className="flex items-center justify-center h-full">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500"></div>
          </div>
        ) : slides.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Belum ada slider</p>
          </div>
        ) : (
          <div className="relative h-full">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                <Image
                  src={slide.image_url}
                  alt={slide.heading}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 z-20 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-xl text-white">
                      <p className="text-brand-300 font-medium mb-2">{slide.sub_heading}</p>
                      <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.heading}</h1>
                      <p className="text-lg text-gray-200 mb-8">{slide.deskripsi}</p>
                      {slide.link && (
                        <a 
                          href={slide.link} 
                          className="bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-lg transition inline-block"
                        >
                          Selengkapnya
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slider Controls */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-3 rounded-full transition"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-3 rounded-full transition"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition ${
                        index === currentSlide ? "bg-brand-500" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Galeri Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lihat koleksi karya dan proyek terbaik kami
            </p>
          </div>

          {loadingGallery ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500"></div>
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada galeri</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleries.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100 cursor-pointer"
                >
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
              ))}
            </div>
          )}

          {/* Link to full gallery */}
          <div className="text-center mt-10">
            <a href="/galeri" className="border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white px-8 py-3 rounded-lg transition inline-block">
              Lihat Semua Galeri
            </a>
          </div>
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

      {/* Articles Section */}
      <section id="articles" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Artikel Terbaru</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Baca insight dan tips terbaru dari tim kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-brand-500 mb-2">{article.date}</p>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-500 transition">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-10">
            <button className="border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-white px-8 py-3 rounded-lg transition">
              Lihat Semua Artikel
            </button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tim Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berkenalan dengan orang-orang hebat di balik layar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teams.map((member) => (
              <div key={member.id} className="text-center group">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
                <div className="flex justify-center space-x-3 mt-3">
                  <a href="#" className="text-gray-400 hover:text-brand-500 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-500 transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hubungi Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Punya pertanyaan atau ingin bekerja sama? Jangan ragu untuk menghubungi kami
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Alamat</h3>
                  <p className="text-gray-600">Jl. Contoh No. 123, Jakarta, Indonesia</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">info@webprofile.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Telepon</h3>
                  <p className="text-gray-600">+62 812 3456 7890</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Nama"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
                />
              </div>
              <input
                type="text"
                placeholder="Subjek"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition"
              />
              <textarea
                rows={5}
                placeholder="Pesan"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition resize-none"
              />
              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-lg transition font-medium"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
