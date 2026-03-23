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
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-[440px] bg-white p-10 rounded-2xl border border-zinc-200">
        <div className="flex p-1 bg-zinc-100 rounded-xl mb-8">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "login"
                ? "bg-white text-black shadow-sm"
                : "text-zinc-400"
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "signup"
                ? "bg-white text-black shadow-sm"
                : "text-zinc-400"
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
