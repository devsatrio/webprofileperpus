"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { visitorService, DailyVisitor, VisitorStats } from "@/services/visitor";
import { ApexOptions } from "apexcharts";

// Dynamic import untuk ReactApexChart (SSR tidak support)
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

export default function VisitorChart() {
    const [stats, setStats] = useState<VisitorStats | null>(null);
    const [chartData, setChartData] = useState<DailyVisitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);

    useEffect(() => {
        fetchData();
    }, [days]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsResult, chartResult] = await Promise.all([
                visitorService.getStats(),
                visitorService.getLastDays(days),
            ]);
            setStats(statsResult);
            setChartData(chartResult);
        } catch (err) {
            console.error("Error fetching visitor data:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString("id-ID");
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
        });
    };

    // Chart options - mengikuti style TailAdmin
    const options: ApexOptions = {
        legend: {
            show: false,
            position: "top",
            horizontalAlign: "left",
        },
        colors: ["#465FFF"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "area",
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: {
                size: 6,
            },
        },
        grid: {
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: (val) => `${val} visitor`,
            },
        },
        xaxis: {
            type: "category",
            categories: chartData.map((d) => formatDate(d.date)),
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: "12px",
                    colors: ["#6B7280"],
                },
                formatter: (val) => Math.round(val).toString(),
            },
        },
    };

    const series = [
        {
            name: "Visitor",
            data: chartData.map((d) => d.count),
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Chart Skeleton */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="animate-pulse">
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="flex gap-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                ))}
                            </div>
                        </div>
                        <div className="h-[310px] bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`animate-pulse h-20 bg-gray-200 dark:bg-gray-700 rounded-xl ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Statistik Visitor
                    </h2>
                    <div className="flex gap-2">
                        {[7, 14, 30].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-3 py-1.5 text-sm rounded-lg transition ${days === d
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {d} Hari
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[500px]">
                        <ReactApexChart
                            options={options}
                            series={series}
                            type="area"
                            height={310}
                        />
                    </div>
                </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow">
                    <p className="text-sm opacity-80">Hari Ini</p>
                    <p className="text-2xl font-bold">{formatNumber(stats?.today || 0)}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow">
                    <p className="text-sm opacity-80">Kemarin</p>
                    <p className="text-2xl font-bold">{formatNumber(stats?.yesterday || 0)}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-xl shadow">
                    <p className="text-sm opacity-80">Minggu Ini</p>
                    <p className="text-2xl font-bold">{formatNumber(stats?.thisWeek || 0)}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow">
                    <p className="text-sm opacity-80">Bulan Ini</p>
                    <p className="text-2xl font-bold">{formatNumber(stats?.thisMonth || 0)}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 text-white p-4 rounded-xl shadow col-span-2 md:col-span-1">
                    <p className="text-sm opacity-80">Total</p>
                    <p className="text-2xl font-bold">{formatNumber(stats?.total || 0)}</p>
                </div>
            </div>
        </div>
    );
}
