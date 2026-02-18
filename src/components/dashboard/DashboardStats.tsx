"use client";
import { useEffect, useState } from "react";
import { artikelService } from "@/services/artikel";
import { galeriService } from "@/services/galeri";

interface ContentStats {
  artikelCount: number;
  galeriCount: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [artikelCount, galeriCount] = await Promise.all([
        artikelService.getCount(),
        galeriService.getCount(),
      ]);
      setStats({ artikelCount, galeriCount });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString("id-ID");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="animate-pulse h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Artikel Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-5 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Total Artikel</p>
            <p className="text-3xl font-bold mt-1">{formatNumber(stats?.artikelCount || 0)}</p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Galeri Card */}
      <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-5 rounded-xl shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Total Gambar Galeri</p>
            <p className="text-3xl font-bold mt-1">{formatNumber(stats?.galeriCount || 0)}</p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
