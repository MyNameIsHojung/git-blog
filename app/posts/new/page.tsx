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
              onClick={handlePublish}
              disabled={submitting || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 disabled:opacity-50"
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
