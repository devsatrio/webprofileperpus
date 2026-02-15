import { supabase } from "@/lib/supabase";

export interface KategoriArtikel {
  id: number;
  nama: string;
  slug: string;
  is_active: boolean;
}

export const kategoriArtikelService = {
  async getAll() {
    const { data, error } = await supabase
      .from("kategori_artikel")
      .select("*")
      .order("id", { ascending: false });
    if (error) throw error;
    return data as KategoriArtikel[];
  },

  async create(payload: Omit<KategoriArtikel, "id">) {
    const { data, error } = await supabase
      .from("kategori_artikel")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as KategoriArtikel;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("kategori_artikel")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as KategoriArtikel;
  },

  async update(id: number, payload: Partial<Omit<KategoriArtikel, "id">>) {
    const { data, error } = await supabase
      .from("kategori_artikel")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as KategoriArtikel;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from("kategori_artikel")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

};
