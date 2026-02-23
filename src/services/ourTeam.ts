import { supabase } from "@/lib/supabase";

export interface OurTeam {
  id: number;
  nama: string;
  deskripsi: string;
  image: string;
}

export const ourTeamService = {
  async getAll() {
    const { data, error } = await supabase
      .from("our_team")
      .select("*")
      .order("id", { ascending: false });
    if (error) throw error;
    return data as OurTeam[];
  },

  async create(payload: Omit<OurTeam, "id">) {
    const { data, error } = await supabase
      .from("our_team")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as OurTeam;
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("our_team")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as OurTeam;
  },

  async update(id: number, payload: Partial<Omit<OurTeam, "id">>) {
    const { data, error } = await supabase
      .from("our_team")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as OurTeam;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from("our_team")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  // Upload image ke Supabase Storage
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `our-team/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);
    return data.publicUrl;
  },

  // Hapus image dari Supabase Storage
  async deleteImage(imageUrl: string) {
    if (!imageUrl) return;

    const urlParts = imageUrl.split("/images/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      await supabase.storage.from("images").remove([filePath]);
    }
  },
};
