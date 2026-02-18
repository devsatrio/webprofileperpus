import { supabase } from "@/lib/supabase";

export interface Artikel {
  id: number;
  judul: string;
  id_kategori: number | null;
  isi: string | null;
  image: string | null;
  slug: string | null;
  created_at: string | null;
  created_by: string | null;
  is_active: boolean | null;
  // Joined data
  kategori_artikel?: {
    id: number;
    nama: string;
  };
}

export interface ArtikelPayload {
  judul: string;
  id_kategori: number | null;
  isi: string | null;
  image: string | null;
  slug: string | null;
  created_at: string | null;
  created_by: string | null;
  is_active: boolean | null;
}

export const artikelService = {
  async getAll() {
    const { data, error } = await supabase
      .from("artikel")
      .select(`
        *,
        kategori_artikel (
          id,
          nama
        )
      `)
      .order("id", { ascending: false });
    if (error) throw error;
    return data as Artikel[];
  },

  async getCount() {
    const { count, error } = await supabase
      .from("artikel")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count || 0;
  },

  async create(payload: ArtikelPayload) {
    const { data, error } = await supabase
      .from("artikel")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as Artikel;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("artikel")
      .select(`
        *,
        kategori_artikel (
          id,
          nama
        )
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Artikel;
  },

  async update(id: number, payload: Partial<ArtikelPayload>) {
    const { data, error } = await supabase
      .from("artikel")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Artikel;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from("artikel")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `artikel/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async deleteImage(imageUrl: string) {
    // Extract file path from URL
    const urlParts = imageUrl.split('/images/');
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      const { error } = await supabase.storage
        .from('images')
        .remove([filePath]);
      if (error) throw error;
    }
  }
};
