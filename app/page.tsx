"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import PostCard from "@/components/PostCard";
import { getPosts, searchPosts } from "@/lib/posts";
import type { Post } from "@/types";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const results = query.trim()
        ? await searchPosts(query)
        : await getPosts();
      setPosts(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen bg-warm-50 dark:bg-dark-950">
      <section className="flex flex-col items-center gap-6 px-12 py-8">
        <h1 className="text-[40px] font-extrabold text-plum dark:text-teal tracking-tight font-[family-name:var(--font-outfit)]">
          블로그에 오신 것을 환영합니다
        </h1>
        <p className="text-base text-brown dark:text-warm-400">
          다양한 주제의 글을 읽고 나만의 이야기를 공유하세요
        </p>
        <SearchBar onSearch={handleSearch} />
      </section>

      <section className="px-12 pb-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-warm-300 dark:border-dark-600 border-t-plum dark:border-t-teal rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-warm-400 dark:text-warm-500">
            아직 작성된 글이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
