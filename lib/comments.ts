import { supabase } from "./supabase";
import type { Comment } from "@/types";

interface RawComment {
  id: string;
  post_id: string;
  author_id: string;
  parent_comment_id: string | null;
  content: string;
  created_at: string;
  users: { username: string };
}

export async function getComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id, author_id, parent_comment_id, content, created_at, users(username)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const raw = data as unknown as RawComment[];
  const comments: Comment[] = raw.map((c) => ({
    id: c.id,
    post_id: c.post_id,
    author_id: c.author_id,
    author_name: c.users.username,
    parent_comment_id: c.parent_comment_id,
    content: c.content,
    created_at: c.created_at,
  }));

  return buildCommentTree(comments);
}

function buildCommentTree(comments: Comment[]): Comment[] {
  const map = new Map<string, Comment>();
  const roots: Comment[] = [];

  for (const comment of comments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of comments) {
    const node = map.get(comment.id)!;
    if (comment.parent_comment_id) {
      const parent = map.get(comment.parent_comment_id);
      if (parent) {
        parent.replies!.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export async function addComment(
  postId: string,
  authorId: string,
  content: string,
  parentCommentId?: string
): Promise<void> {
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: authorId,
    content,
    parent_comment_id: parentCommentId || null,
  });

  if (error) throw error;
}
