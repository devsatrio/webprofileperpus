import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

// Fetch app setting for metadata
async function getAppSetting() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data } = await supabase.from("app_setting").select("*").limit(1).single();
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getAppSetting();

  return {
    title: setting?.nama_program || "WebProfile",
    description: setting?.deskripsi || "Website profil resmi",
    keywords: setting?.nama_program ? [setting.nama_program, setting.singkatan_program] : ["webprofile"],
    openGraph: {
      title: setting?.nama_program || "WebProfile",
      description: setting?.deskripsi || "Website profil resmi",
      type: "website",
    },
  };
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
