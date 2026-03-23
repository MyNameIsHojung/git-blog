"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getPost } from "@/lib/posts";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import EditedBadge from "@/components/EditedBadge";
import CommentSection from "@/components/CommentSection";
import { formatDateLong, getInitial } from "@/lib/utils";
import type { Post } from "@/types";

function PostDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const postId = searchParams.get("id");
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      router.push("/");
      return;
    }
    getPost(postId)
      .then((data) => {
        if (!data) router.push("/");
        else setPost(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user?.id === post.author_id;

  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-extrabold text-black tracking-tight leading-tight font-[family-name:var(--font-outfit)]">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            {post.is_edited && post.updated_at && (
              <EditedBadge updatedAt={post.updated_at} />
            )}
            {isAuthor && (
              <Link
                href={`/posts/edit?id=${post.id}`}
                className="px-4 py-2 text-sm font-medium text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-50"
              >
                수정
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold font-[family-name:var(--font-outfit)]">
              {getInitial(post.author_name)}
            </span>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-black">{post.author_name}</p>
            <p className="text-[13px] text-zinc-400">{formatDateLong(post.created_at)}</p>
          </div>
        </div>

        <hr className="border-zinc-200 mb-8" />

        <MarkdownRenderer content={post.content} />

        <hr className="border-zinc-200 my-8" />

        <CommentSection postId={post.id} postAuthorId={post.author_id} />
      </article>
    </main>
  );
}

export default function PostDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
        </div>
      }
    >
      <PostDetailContent />
    </Suspense>
  );
}
