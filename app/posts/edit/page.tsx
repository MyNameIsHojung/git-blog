"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getPost, updatePost } from "@/lib/posts";
import { getExcerpt } from "@/lib/utils";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownRenderer from "@/components/MarkdownRenderer";

function EditPostContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const postId = searchParams.get("id");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (!postId) {
      router.push("/");
      return;
    }

    getPost(postId)
      .then((post) => {
        if (!post || post.author_id !== user?.id) {
          router.push("/");
          return;
        }
        setTitle(post.title);
        setContent(post.content);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [postId, user, isLoading, router]);

  const handleUpdate = async () => {
    if (!postId || !title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const excerpt = getExcerpt(content);
      await updatePost(postId, title, content, excerpt);
      router.push(`/posts?id=${postId}`);
    } catch (error) {
      console.error(error);
      alert("글 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                !showPreview ? "bg-zinc-100 text-black" : "text-zinc-400"
              }`}
            >
              편집
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                showPreview ? "bg-zinc-100 text-black" : "text-zinc-400"
              }`}
            >
              미리보기
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 text-sm font-medium text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-50"
            >
              취소
            </button>
            <button
              onClick={handleUpdate}
              disabled={submitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 disabled:opacity-50"
            >
              {submitting ? "수정 중..." : "수정하기"}
            </button>
          </div>
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full text-[32px] font-extrabold text-black tracking-tight font-[family-name:var(--font-outfit)] placeholder-zinc-300 border-b-2 border-zinc-200 pb-4 mb-6 outline-none focus:border-black transition-colors"
        />

        {showPreview ? (
          <div className="min-h-[500px] p-6 border border-zinc-200 rounded-xl bg-zinc-50">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <MarkdownEditor value={content} onChange={setContent} />
        )}
      </div>
    </main>
  );
}

export default function EditPostPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
        </div>
      }
    >
      <EditPostContent />
    </Suspense>
  );
}
