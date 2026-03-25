"use client";

import { useState } from "react";
import type { Comment } from "@/types";
import { formatDate, getInitial } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { addComment } from "@/lib/comments";

interface CommentItemProps {
  comment: Comment;
  postAuthorId: string;
  onCommentAdded: () => void;
  depth?: number;
}

export default function CommentItem({
  comment,
  postAuthorId,
  onCommentAdded,
  depth = 0,
}: CommentItemProps) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!user || !replyContent.trim()) return;
    setLoading(true);
    try {
      await addComment(comment.post_id, user.id, replyContent, comment.id);
      setReplyContent("");
      setShowReply(false);
      onCommentAdded();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isPostAuthor = comment.author_id === postAuthorId;

  return (
    <div>
      <div
        className="flex gap-3 py-5 border-b border-warm-100 dark:border-dark-800"
        style={{ paddingLeft: depth > 0 ? 44 : 0 }}
      >
        <div
          className={`shrink-0 ${depth > 0 ? "w-7 h-7" : "w-8 h-8"} rounded-full flex items-center justify-center ${
            isPostAuthor ? "bg-sage" : "bg-brown dark:bg-olive-brown"
          }`}
        >
          <span className={`text-white font-bold font-[family-name:var(--font-outfit)] ${depth > 0 ? "text-[10px]" : "text-xs"}`}>
            {getInitial(comment.author_name)}
          </span>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-plum dark:text-warm-200">{comment.author_name}</span>
            {isPostAuthor && (
              <span className="px-2 py-0.5 bg-sage dark:bg-teal text-white dark:text-dark-950 text-[10px] font-semibold rounded">
                작성자
              </span>
            )}
            <span className="text-xs text-warm-400 dark:text-warm-500">{formatDate(comment.created_at)}</span>
          </div>
          <p className="text-sm text-brown dark:text-warm-300 leading-relaxed">{comment.content}</p>
          {user && (
            <button
              onClick={() => setShowReply(!showReply)}
              className="text-[13px] font-medium text-olive-brown dark:text-warm-400 hover:text-plum dark:hover:text-teal w-fit transition-colors"
            >
              답글
            </button>
          )}
          {showReply && (
            <div className="flex flex-col gap-2 mt-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="답글을 작성하세요..."
                rows={2}
                className="w-full px-3 py-2 text-sm text-plum dark:text-warm-200 bg-white dark:bg-dark-900 border border-warm-200 dark:border-dark-700 rounded-lg outline-none focus:border-plum dark:focus:border-teal resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReply(false)}
                  className="px-3 py-1.5 text-xs text-warm-400 rounded"
                >
                  취소
                </button>
                <button
                  onClick={handleReply}
                  disabled={loading || !replyContent.trim()}
                  className="px-3 py-1.5 bg-plum dark:bg-teal text-white dark:text-dark-950 text-xs font-medium rounded disabled:opacity-50 transition-colors"
                >
                  {loading ? "작성 중..." : "답글 작성"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postAuthorId={postAuthorId}
          onCommentAdded={onCommentAdded}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
