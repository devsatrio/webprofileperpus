import { supabase } from "@/lib/supabase";
import { KategoriGaleri } from "./kategoriGaleri";

export interface Galeri {
    id: number;
    keterangan: string;
    image_url: string;
    id_kategori: number;
    is_active: boolean;
    kategori_galeri?: KategoriGaleri;
}

export interface GaleriWithKategori extends Galeri {
    kategori_galeri: KategoriGaleri;
}

export const galeriService = {
    async getAll() {
        const { data, error } = await supabase
            .from("galeri")
            .select(`
                *,
                kategori_galeri (
                    id,
                    nama,
                    slug,
                    is_active
                )
            `)
            .order("id", { ascending: false });
        if (error) throw error;
        return data as GaleriWithKategori[];
    },

    async getCount() {
        const { count, error } = await supabase
            .from("galeri")
            .select("*", { count: "exact", head: true });
        if (error) throw error;
        return count || 0;
    },

    // Get latest active galleries with limit
    async getLatest(limit: number = 6) {
        const { data, error } = await supabase
            .from("galeri")
            .select(`
                *,
                kategori_galeri (
                    id,
                    nama,
                    slug,
                    is_active
                )
            `)
            .eq("is_active", true)
            .order("id", { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data as GaleriWithKategori[];
    },

    async getById(id: number) {
        const { data, error } = await supabase
            .from("galeri")
            .select(`
                *,
                kategori_galeri (
                    id,
                    nama,
                    slug,
                    is_active
                )
            `)
            .eq("id", id)
            .single();
        if (error) throw error;
        return data as GaleriWithKategori;
    },

    async create(payload: Omit<Galeri, "id" | "kategori_galeri">) {
        const { data, error } = await supabase
            .from("galeri")
            .insert([payload])
            .select()
            .single();
        if (error) throw error;
        return data as Galeri;
    },

    async update(id: number, payload: Partial<Omit<Galeri, "id" | "kategori_galeri">>) {
        const { data, error } = await supabase
            .from("galeri")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data as Galeri;
    },

    async delete(id: number) {
        const { error } = await supabase
            .from("galeri")
            .delete()
            .eq("id", id);
        if (error) throw error;
    },

    // Upload image ke Supabase Storage
    async uploadImage(file: File): Promise<string> {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `galeri/${fileName}`;

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
