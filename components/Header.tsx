"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getInitial } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-12 py-5 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
      <Link href="/" className="text-[28px] font-extrabold tracking-tight text-black dark:text-white font-[family-name:var(--font-outfit)]">
        Git Blog
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user && (
          <Link
            href="/posts/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            글 작성
          </Link>
        )}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <span className="text-white dark:text-black text-[10px] font-bold font-[family-name:var(--font-outfit)]">
                  {getInitial(user.username)}
                </span>
              </div>
              <span className="text-sm font-medium text-black dark:text-white">{user.username}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-medium text-black dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
