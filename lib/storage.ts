import { supabase } from "./supabase";

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const filePath = `posts/${fileName}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("post-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
