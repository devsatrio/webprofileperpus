import { supabase } from "@/lib/supabase";

export interface KategoriGaleri {
  id: number;
  nama: string;
  slug: string;
  is_active: boolean;
}

export const kategoriGaleriService = {
  async getAll() {
    const { data, error } = await supabase
      .from("kategori_galeri")
      .select("*")
      .order("id", { ascending: false });
    if (error) throw error;
    return data as KategoriGaleri[];
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("kategori_galeri")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as KategoriGaleri;
  },

  async create(payload: Omit<KategoriGaleri, "id">) {
    const { data, error } = await supabase
      .from("kategori_galeri")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as KategoriGaleri;
  },

  async update(id: number, payload: Partial<Omit<KategoriGaleri, "id">>) {
    const { data, error } = await supabase
      .from("kategori_galeri")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as KategoriGaleri;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from("kategori_galeri")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
