"use client";
import { useEffect, useState } from "react";
import { visitorService, Visitor } from "@/services/visitor";
import VisitorChart from "@/components/visitor/VisitorChart";
import ComponentCard from "@/components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function VisitorPage() {
  const [data, setData] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await visitorService.getAll(page, limit);
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      console.error("Error fetching visitor data:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateUserAgent = (ua: string | null, maxLength: number = 60) => {
    if (!ua) return "-";
    return ua.length > maxLength ? ua.substring(0, maxLength) + "..." : ua;
  };

  return (
    <div className="space-y-6">

      {/* Table */}
      <ComponentCard title="Riwayat Kunjungan">
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
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400">Belum ada data visitor</p>
              </div>
            </div>
          ) : (
            <div className="max-w-full overflow-x-auto">
              <Table>
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
                      IP Address
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Tanggal & Waktu
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      User Agent
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {data.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 text-center font-medium">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-700 dark:text-gray-300 text-theme-sm font-mono">
                        {item.ip_address || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {formatDateTime(item.created_at)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <span title={item.user_agent || ""}>
                          {truncateUserAgent(item.user_agent)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/[0.05]">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Halaman {page} dari {totalPages} ({total} data)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white transition"
              >
                ← Sebelumnya
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white transition"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        )}
      </ComponentCard>
      {/* Chart & Stats */}
      <VisitorChart />
    </div>
  );
}
