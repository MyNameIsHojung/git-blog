"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { getComments, addComment } from "@/lib/comments";
import CommentItem from "./CommentItem";
import type { Comment } from "@/types";

interface CommentSectionProps {
  postId: string;
  postAuthorId: string;
}

export default function CommentSection({ postId, postAuthorId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const loadComments = useCallback(async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
      const count = countComments(data);
      setTotalCount(count);
    } catch (error) {
      console.error(error);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  function countComments(comments: Comment[]): number {
    let count = 0;
    for (const c of comments) {
      count += 1;
      if (c.replies) count += countComments(c.replies);
    }
    return count;
  }

  const handleSubmit = async () => {
    if (!user || !content.trim()) return;
    setLoading(true);
    try {
      await addComment(postId, user.id, content);
      setContent("");
      await loadComments();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl font-extrabold text-black dark:text-white font-[family-name:var(--font-outfit)]">
        댓글 {totalCount}개
      </h3>

      {user ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 작성하세요..."
            rows={3}
            className="w-full px-4 py-3.5 text-sm text-black dark:text-white bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none focus:border-black dark:focus:border-white resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-[13px] font-medium rounded-lg disabled:opacity-50"
            >
              {loading ? "작성 중..." : "댓글 작성"}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-400 py-4 text-center border border-zinc-200 dark:border-zinc-700 rounded-lg">
          댓글을 작성하려면 로그인이 필요합니다.
        </p>
      )}

      <div>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postAuthorId={postAuthorId}
            onCommentAdded={loadComments}
          />
        ))}
      </div>
    </div>
  );
}
