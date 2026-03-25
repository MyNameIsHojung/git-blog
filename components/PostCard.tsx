"use client";

import Link from "next/link";
import type { Post } from "@/types";
import { formatDate, getInitial } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts?id=${post.id}`} className="block">
      <div className="flex flex-col gap-4 p-6 bg-warm-100 dark:bg-dark-900 rounded-2xl hover:bg-warm-200/70 dark:hover:bg-dark-800 border border-warm-200 dark:border-dark-700 transition-colors">
        <h2 className="text-xl font-extrabold text-plum dark:text-warm-100 font-[family-name:var(--font-outfit)] leading-snug">
          {post.title}
        </h2>
        <p className="text-sm text-brown dark:text-warm-400 leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-sage dark:bg-teal rounded-full flex items-center justify-center">
              <span className="text-white dark:text-dark-950 text-xs font-bold font-[family-name:var(--font-outfit)]">
                {getInitial(post.author_name)}
              </span>
            </div>
            <span className="text-[13px] font-medium text-brown dark:text-warm-400">{post.author_name}</span>
            <span className="text-[13px] text-warm-400 dark:text-warm-500">·</span>
            <span className="text-[13px] text-warm-400 dark:text-warm-500">{formatDate(post.created_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warm-400 dark:text-warm-500"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            <span className="text-[13px] font-medium text-warm-400 dark:text-warm-500">{post.comment_count}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
