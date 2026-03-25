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
        <div className="w-8 h-8 border-2 border-warm-300 dark:border-dark-600 border-t-plum dark:border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-warm-50 dark:bg-dark-950">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(false)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !showPreview ? "bg-warm-100 dark:bg-dark-800 text-plum dark:text-teal" : "text-warm-400"
              }`}
            >
              편집
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                showPreview ? "bg-warm-100 dark:bg-dark-800 text-plum dark:text-teal" : "text-warm-400"
              }`}
            >
              미리보기
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 text-sm font-medium text-brown dark:text-warm-400 border border-warm-200 dark:border-dark-700 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-800 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleUpdate}
              disabled={submitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-plum dark:bg-teal text-white dark:text-dark-950 text-sm font-semibold rounded-lg hover:bg-plum-light dark:hover:bg-teal-light disabled:opacity-50 transition-colors"
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
          className="w-full text-[32px] font-extrabold text-plum dark:text-warm-100 tracking-tight font-[family-name:var(--font-outfit)] placeholder-warm-300 dark:placeholder-dark-600 border-b-2 border-warm-200 dark:border-dark-700 pb-4 mb-6 outline-none focus:border-plum dark:focus:border-teal transition-colors bg-transparent"
        />

        {showPreview ? (
          <div className="min-h-[500px] p-6 border border-warm-200 dark:border-dark-700 rounded-xl bg-warm-100 dark:bg-dark-900">
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
          <div className="w-8 h-8 border-2 border-warm-300 dark:border-dark-600 border-t-plum dark:border-t-teal rounded-full animate-spin" />
        </div>
      }
    >
      <EditPostContent />
    </Suspense>
  );
}
