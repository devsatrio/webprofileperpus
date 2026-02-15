import { supabase } from "@/lib/supabase";

export interface AppSetting {
  id: number;
  nama_program: string;
  singkatan_program: string;
  deskripsi: string;
  motto: string;
  visi_misi: string;
  alamat: string;
  email: string;
  no_telp_satu: string;
  no_telp_dua: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

export const appSettingService = {
  // Get first/only record
  async getFirst() {
    const { data, error } = await supabase
      .from("app_setting")
      .select("*")
      .limit(1)
      .single();
    if (error) throw error;
    return data as AppSetting;
  },

  // Update setting
  async update(id: number, payload: Partial<Omit<AppSetting, "id">>) {
    const { data, error } = await supabase
      .from("app_setting")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as AppSetting;
  },
};
