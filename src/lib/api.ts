import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Brand = Tables<"brands">;
export type Product = Tables<"products"> & { brands?: Brand };
export type Category = Tables<"categories">;
export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

// ─── Brands ───
export const useBrands = () =>
  useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").order("name");
      if (error) throw error;
      return data as Brand[];
    },
  });

export const useBrand = (slug: string) =>
  useQuery({
    queryKey: ["brands", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").eq("slug", slug).single();
      if (error) throw error;
      return data as Brand;
    },
    enabled: !!slug,
  });

export const useCreateBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (brand: TablesInsert<"brands">) => {
      const { data, error } = await supabase.from("brands").insert(brand).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });
};

export const useUpdateBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"brands"> & { id: string }) => {
      const { data, error } = await supabase.from("brands").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });
};

export const useDeleteBrand = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("brands").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["brands"] }),
  });
};

// ─── Products ───
export const useProducts = (filters?: { category?: string; brandSlug?: string }) =>
  useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase.from("products").select("*, brands(*)").order("name");
      if (filters?.category) query = query.eq("category", filters.category);
      if (filters?.brandSlug) {
        const { data: brand } = await supabase.from("brands").select("id").eq("slug", filters.brandSlug).single();
        if (brand) query = query.eq("brand_id", brand.id);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ["products", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*, brands(*)").eq("slug", slug).single();
      if (error) throw error;
      return data as Product;
    },
    enabled: !!slug,
  });

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*, brands(*)").eq("featured", true).order("name");
      if (error) throw error;
      return data as Product[];
    },
  });

export const useOurProducts = () =>
  useQuery({
    queryKey: ["products", "our_products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*, brands(*)").eq("our_product" as any, true).order("name");
      if (error) throw error;
      return data as Product[];
    },
  });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: TablesInsert<"products">) => {
      const { data, error } = await supabase.from("products").insert(product).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"products"> & { id: string }) => {
      const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
};

// ─── Product Images ───
export const useProductImages = (productId: string) =>
  useQuery({
    queryKey: ["product_images", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_images" as any)
        .select("*")
        .eq("product_id", productId)
        .order("sort_order");
      if (error) throw error;
      return (data as unknown) as ProductImage[];
    },
    enabled: !!productId,
  });

export const useAddProductImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (image: { product_id: string; image_url: string; sort_order?: number }) => {
      const { data, error } = await supabase
        .from("product_images" as any)
        .insert(image)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["product_images", vars.product_id] }),
  });
};

export const useDeleteProductImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, product_id }: { id: string; product_id: string }) => {
      const { error } = await supabase.from("product_images" as any).delete().eq("id", id);
      if (error) throw error;
      return product_id;
    },
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ["product_images", vars.product_id] }),
  });
};

// ─── Categories ───
export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data as Category[];
    },
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cat: TablesInsert<"categories">) => {
      const { data, error } = await supabase.from("categories").insert(cat).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: TablesUpdate<"categories"> & { id: string }) => {
      const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
};

// ─── Contact Submissions ───
export type ContactSubmission = Tables<"contact_submissions">;

export const useContactSubmissions = () =>
  useQuery({
    queryKey: ["contact_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

export const useDeleteSubmission = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contact_submissions"] }),
  });
};

// ─── Auth helpers ───
export const useIsAdmin = () =>
  useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
      return (data && data.length > 0) ?? false;
    },
  });
