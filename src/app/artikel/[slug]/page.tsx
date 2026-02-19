"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LandingLayout } from "@/components/landing";
import { artikelService, Artikel } from "@/services/artikel";

// Helper function to strip HTML and clean text for excerpt
const stripHtmlAndClean = (html: string, maxLength: number = 100): string => {
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

export default function ArtikelDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<Artikel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Artikel[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await artikelService.getBySlug(slug);
        setArticle(data);

        // Fetch related articles (same category or latest)
        const allArticles = await artikelService.getLatest(4);
        const related = allArticles.filter(
          (a) => a.id !== data.id && a.id_kategori === data.id_kategori
        );
        // If not enough related from same category, fill with other articles
        if (related.length < 3) {
          const others = allArticles.filter(
            (a) => a.id !== data.id && !related.find((r) => r.id === a.id)
          );
          related.push(...others.slice(0, 3 - related.length));
        }
        setRelatedArticles(related.slice(0, 3));
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Artikel tidak ditemukan");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <LandingLayout>
        <div className="pt-32 pb-16 min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500"></div>
        </div>
      </LandingLayout>
    );
  }

  if (error || !article) {
    return (
      <LandingLayout>
        <div className="pt-32 pb-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
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
            <h1 className="text-3xl font-bold text-gray-700 mb-4">
              Artikel tidak ditemukan
            </h1>
            <p className="text-gray-500 mb-8">
              Artikel yang Anda cari mungkin telah dihapus atau tidak tersedia.
            </p>
            <Link
              href="/artikel"
              className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-lg transition inline-block"
            >
              Kembali ke Daftar Artikel
            </Link>
          </div>
        </div>
      </LandingLayout>
    );
  }

  return (
    <LandingLayout>
      {/* Hero Section with Image */}
      <section className="pt-20">
        <div className="relative h-[50vh] min-h-[400px] bg-gray-900">
          {article.image && (
            <Image
              src={article.image}
              alt={article.judul}
              fill
              className="object-cover opacity-50"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-300 mb-4">
                <Link href="/" className="hover:text-white transition">
                  Beranda
                </Link>
                <span>/</span>
                <Link href="/artikel" className="hover:text-white transition">
                  Artikel
                </Link>
                <span>/</span>
                <span className="text-white truncate">{article.judul}</span>
              </nav>

              {/* Category Badge */}
              {article.kategori_artikel && (
                <span className="inline-block bg-brand-500 text-white text-sm font-medium px-4 py-1 rounded-full mb-4">
                  {article.kategori_artikel.nama}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {article.judul}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-300">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {article.created_at
                      ? new Date(article.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </div>
                {article.created_by && (
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>{article.created_by}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Body - Render HTML */}
          <article
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-brand-500 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-ul:list-disc prose-ol:list-decimal
              prose-li:text-gray-700
              prose-img:rounded-lg prose-img:shadow-md
              prose-blockquote:border-l-4 prose-blockquote:border-brand-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
              prose-pre:bg-gray-900 prose-pre:text-gray-100
              prose-code:text-brand-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
              prose-table:border-collapse prose-th:bg-gray-100 prose-th:p-3 prose-td:p-3 prose-td:border prose-th:border"
            dangerouslySetInnerHTML={{ __html: article.isi || "" }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-gray-600 font-medium mb-2">Bagikan artikel ini:</p>
                <div className="flex space-x-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      article.judul
                    )}&url=${encodeURIComponent(
                      typeof window !== "undefined" ? window.location.href : ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                    </svg>
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `${article.judul} - ${typeof window !== "undefined" ? window.location.href : ""}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </div>
              <Link
                href="/artikel"
                className="flex items-center text-brand-500 font-medium hover:text-brand-600 transition"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Kembali ke Daftar Artikel
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Artikel Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/artikel/${relatedArticle.slug || relatedArticle.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group block"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={relatedArticle.image || "/images/cards/card-01.png"}
                      alt={relatedArticle.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {relatedArticle.kategori_artikel && (
                      <span className="absolute top-3 left-3 bg-brand-500 text-white text-xs px-3 py-1 rounded-full">
                        {relatedArticle.kategori_artikel.nama}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-brand-500 mb-2">
                      {relatedArticle.created_at
                        ? new Date(relatedArticle.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "-"}
                    </p>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-500 transition line-clamp-2">
                      {relatedArticle.judul}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {stripHtmlAndClean(relatedArticle.isi || "", 100)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </LandingLayout>
  );
}
