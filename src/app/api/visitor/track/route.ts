import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Ambil IP dari headers
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "unknown";

    // Skip localhost - jangan simpan ke database
    const isLocalhost = 
      ip === "::1" || 
      ip === "127.0.0.1" || 
      ip === "::ffff:127.0.0.1" || 
      ip === "localhost" ||
      ip === "unknown";

    if (isLocalhost) {
      return NextResponse.json({
        tracked: false,
        message: "Localhost not tracked",
      });
    }

    const userAgent = request.headers.get("user-agent") || null;
    const today = new Date().toISOString().split("T")[0];

    // Cek apakah IP ini sudah di-track hari ini
    const { data: existing } = await supabase
      .from("visitor")
      .select("id")
      .eq("ip_address", ip)
      .eq("visit_date", today)
      .single();

    // Jika sudah ada, skip
    if (existing) {
      return NextResponse.json({
        tracked: false,
        message: "Already tracked today",
      });
    }

    // Insert visitor baru
    const { error } = await supabase.from("visitor").insert({
      ip_address: ip,
      visit_date: today,
      user_agent: userAgent,
    });

    if (error) {
      // Jika duplicate (race condition), abaikan
      if (error.code === "23505") {
        return NextResponse.json({ tracked: false, message: "Duplicate" });
      }
      throw error;
    }

    return NextResponse.json({ tracked: true, message: "Visitor tracked" });
  } catch (error: unknown) {
    console.error("Error tracking visitor:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { tracked: false, error: errorMessage },
      { status: 500 }
    );
  }
}
