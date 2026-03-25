"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createPost } from "@/lib/posts";
import { getExcerpt } from "@/lib/utils";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function NewPostPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handlePublish = async () => {
    if (!user || !title.trim() || !content.trim()) return;
    setSubmitting(true);
    try {
      const excerpt = getExcerpt(content);
      const post = await createPost(title, content, excerpt, user.id);
      if (post) {
        router.push(`/posts?id=${post.id}`);
      }
    } catch (error) {
      console.error(error);
      alert("글 발행에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !user) return null;

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
              onClick={handlePublish}
              disabled={submitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-plum dark:bg-teal text-white dark:text-dark-950 text-sm font-semibold rounded-lg hover:bg-plum-light dark:hover:bg-teal-light disabled:opacity-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
              {submitting ? "발행 중..." : "발행하기"}
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
