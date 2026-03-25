"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getInitial } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-12 py-5 bg-warm-50 dark:bg-dark-950 border-b border-warm-200 dark:border-dark-700">
      <Link href="/" className="text-[28px] font-extrabold tracking-tight text-plum dark:text-teal font-[family-name:var(--font-outfit)]">
        Git Blog
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user && (
          <Link
            href="/posts/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-plum dark:bg-teal text-white dark:text-dark-950 rounded-lg text-sm font-medium hover:bg-plum-light dark:hover:bg-teal-light transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            글 작성
          </Link>
        )}
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-warm-100 dark:bg-dark-800 rounded-lg">
              <div className="w-6 h-6 bg-sage dark:bg-teal rounded-full flex items-center justify-center">
                <span className="text-white dark:text-dark-950 text-[10px] font-bold font-[family-name:var(--font-outfit)]">
                  {getInitial(user.username)}
                </span>
              </div>
              <span className="text-sm font-medium text-plum dark:text-warm-200">{user.username}</span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2.5 text-sm font-medium text-brown dark:text-warm-400 border border-warm-200 dark:border-dark-700 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-800 transition-colors"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-5 py-2.5 text-sm font-medium text-plum dark:text-warm-200 border border-warm-200 dark:border-dark-700 rounded-lg hover:bg-warm-100 dark:hover:bg-dark-800 transition-colors"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
