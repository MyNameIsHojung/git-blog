import { supabase } from "./supabase";
import { hashPassword, generateSalt } from "./utils";
import type { User } from "@/types";

const SESSION_KEY = "git-blog-session";

export interface AuthResult {
  user?: User;
  error?: string;
  attemptsRemaining?: number;
  lockedUntil?: string;
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function storeUser(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data: users, error: fetchError } = await supabase
    .from("users")
    .select("id, email, username, password_hash, salt, failed_login_count, locked_until")
    .eq("email", email)
    .limit(1);

  if (fetchError || !users || users.length === 0) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  const user = users[0];

  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    return {
      error: "5회 로그인 실패로 계정이 잠겼습니다.",
      lockedUntil: user.locked_until,
    };
  }

  const hashedInput = await hashPassword(password, user.salt);

  if (hashedInput !== user.password_hash) {
    const newCount = (user.failed_login_count || 0) + 1;
    const updateData: Record<string, unknown> = {
      failed_login_count: newCount,
    };

    if (newCount >= 5) {
      const lockTime = new Date();
      lockTime.setMinutes(lockTime.getMinutes() + 10);
      updateData.locked_until = lockTime.toISOString();
    }

    await supabase.from("users").update(updateData).eq("id", user.id);

    if (newCount >= 5) {
      return {
        error: "5회 로그인 실패로 계정이 10분간 잠겼습니다.",
        attemptsRemaining: 0,
      };
    }

    return {
      error: "이메일 또는 비밀번호가 올바르지 않습니다.",
      attemptsRemaining: 5 - newCount,
    };
  }

  await supabase
    .from("users")
    .update({ failed_login_count: 0, locked_until: null })
    .eq("id", user.id);

  const sessionUser: User = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  storeUser(sessionUser);
  return { user: sessionUser };
}

export async function signup(
  email: string,
  username: string,
  password: string
): Promise<AuthResult> {
  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);

  const { data, error } = await supabase
    .from("users")
    .insert({
      email,
      username,
      password_hash: passwordHash,
      salt,
    })
    .select("id, email, username")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "이미 사용 중인 이메일 또는 사용자명입니다." };
    }
    return { error: "회원가입 중 오류가 발생했습니다." };
  }

  const sessionUser: User = {
    id: data.id,
    email: data.email,
    username: data.username,
  };

  storeUser(sessionUser);
  return { user: sessionUser };
}
