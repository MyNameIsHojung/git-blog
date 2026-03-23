"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);
    try {
      const result = await signup(email, username, password);
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
      }
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-black">이메일</label>
        <input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3.5 text-sm border border-zinc-200 rounded-lg outline-none focus:border-black transition-colors"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-black">사용자명</label>
        <input
          type="text"
          placeholder="사용자명을 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-3.5 text-sm border border-zinc-200 rounded-lg outline-none focus:border-black transition-colors"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-black">비밀번호</label>
        <input
          type="password"
          placeholder="최소 6자 이상"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3.5 text-sm border border-zinc-200 rounded-lg outline-none focus:border-black transition-colors"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-black">비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3.5 text-sm border border-zinc-200 rounded-lg outline-none focus:border-black transition-colors"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span className="text-[13px] text-red-500">{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-black text-white text-[15px] font-semibold rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-colors"
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>
    </form>
  );
}
