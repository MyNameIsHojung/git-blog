"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-warm-50 dark:bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-[440px] bg-white dark:bg-dark-900 p-10 rounded-2xl border border-warm-200 dark:border-dark-700">
        <div className="flex p-1 bg-warm-100 dark:bg-dark-800 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "login"
                ? "bg-white dark:bg-dark-700 text-plum dark:text-teal shadow-sm"
                : "text-warm-400"
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "signup"
                ? "bg-white dark:bg-dark-700 text-plum dark:text-teal shadow-sm"
                : "text-warm-400"
            }`}
          >
            회원가입
          </button>
        </div>

        {activeTab === "login" ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <SignupForm onSuccess={handleSuccess} />
        )}
      </div>
    </main>
  );
}
