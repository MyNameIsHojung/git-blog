import { supabase } from "./supabase";
import type { Post } from "@/types";

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts_with_details")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function searchPosts(query: string): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts_with_details")
    .select("*")
    .or(`title.ilike.%${query}%,author_name.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Post[];
}

export async function getPost(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts_with_details")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Post;
}

export async function createPost(
  title: string,
  content: string,
  excerpt: string,
  authorId: string
): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, excerpt, author_id: authorId })
    .select("id")
    .single();

  if (error) throw error;
  return getPost(data.id);
}

export async function updatePost(
  id: string,
  title: string,
  content: string,
  excerpt: string
): Promise<Post | null> {
  const { error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      excerpt,
      is_edited: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  return getPost(id);
}
