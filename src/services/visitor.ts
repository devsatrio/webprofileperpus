import { supabase } from "@/lib/supabase";

export interface Visitor {
  id: string;
  created_at: string;
  ip_address: string | null;
  visit_date: string | null;
  user_agent: string | null;
}

export interface VisitorStats {
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}

export interface DailyVisitor {
  date: string;
  count: number;
}

export const visitorService = {
  // Track visitor via API
  async trackVisitor(): Promise<boolean> {
    try {
      const response = await fetch("/api/visitor/track", {
        method: "POST",
      });
      const data = await response.json();
      return data.tracked;
    } catch (err) {
      console.error("Error tracking visitor:", err);
      return false;
    }
  },

  // Get statistik visitor
  async getStats(): Promise<VisitorStats> {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Awal minggu ini (Senin)
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    const startOfWeekStr = startOfWeek.toISOString().split("T")[0];

    // Awal bulan ini
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonthStr = startOfMonth.toISOString().split("T")[0];

    // Query hari ini
    const { count: todayCount } = await supabase
      .from("visitor")
      .select("*", { count: "exact", head: true })
      .eq("visit_date", todayStr);

    // Query kemarin
    const { count: yesterdayCount } = await supabase
      .from("visitor")
      .select("*", { count: "exact", head: true })
      .eq("visit_date", yesterdayStr);

    // Query minggu ini
    const { count: weekCount } = await supabase
      .from("visitor")
      .select("*", { count: "exact", head: true })
      .gte("visit_date", startOfWeekStr)
      .lte("visit_date", todayStr);

    // Query bulan ini
    const { count: monthCount } = await supabase
      .from("visitor")
      .select("*", { count: "exact", head: true })
      .gte("visit_date", startOfMonthStr)
      .lte("visit_date", todayStr);

    // Query total
    const { count: totalCount } = await supabase
      .from("visitor")
      .select("*", { count: "exact", head: true });

    return {
      today: todayCount || 0,
      yesterday: yesterdayCount || 0,
      thisWeek: weekCount || 0,
      thisMonth: monthCount || 0,
      total: totalCount || 0,
    };
  },

  // Get data untuk chart (optimized - single query)
  async getLastDays(days: number = 7): Promise<DailyVisitor[]> {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (days - 1));

    const { data, error } = await supabase
      .from("visitor")
      .select("visit_date")
      .gte("visit_date", startDate.toISOString().split("T")[0])
      .lte("visit_date", today.toISOString().split("T")[0]);

    if (error) throw error;

    // Group by date
    const countMap: Record<string, number> = {};
    data?.forEach((item) => {
      if (item.visit_date) {
        countMap[item.visit_date] = (countMap[item.visit_date] || 0) + 1;
      }
    });

    // Generate result dengan semua tanggal (termasuk yang 0)
    const result: DailyVisitor[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        count: countMap[dateStr] || 0,
      });
    }

    return result;
  },

  // Get semua data dengan pagination
  async getAll(
    page: number = 1,
    limit: number = 20
  ): Promise<{ data: Visitor[]; total: number }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("visitor")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data: data || [], total: count || 0 };
  },
};
