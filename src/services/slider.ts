import { supabase } from "@/lib/supabase";

export interface Slider {
  id: number;
  heading: string;
  sub_heading: string;
  deskripsi: string;
  link: string;
  image_url: string;
  is_active: boolean;
}

export const sliderService = {
  async getAll() {
    const { data, error } = await supabase
      .from("slider")
      .select("*")
      .order("id", { ascending: false });
    if (error) throw error;
    return data as Slider[];
  },

  // Get active sliders only
  async getActive() {
    const { data, error } = await supabase
      .from("slider")
      .select("*")
      .eq("is_active", true)
      .order("id", { ascending: true });
    if (error) throw error;
    return data as Slider[];
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from("slider")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Slider;
  },

  async create(payload: Omit<Slider, "id">) {
    const { data, error } = await supabase
      .from("slider")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as Slider;
  },

  async update(id: number, payload: Partial<Omit<Slider, "id">>) {
    const { data, error } = await supabase
      .from("slider")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Slider;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from("slider")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  // Upload image ke Supabase Storage
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `slider/${fileName}`;

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
    
    // Extract path dari URL
    const urlParts = imageUrl.split("/images/");
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      await supabase.storage.from("images").remove([filePath]);
    }
  },
};
