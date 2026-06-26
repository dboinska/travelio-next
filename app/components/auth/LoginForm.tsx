"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, type SignInResponse } from "next-auth/react";
import { brandGradientBg, inputClassName, labelClassName } from "@/lib/design/classes";
import { cn } from "@/lib/cn";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const result = (await signIn("credentials", {
        redirect: false,
        username,
        password,
        callbackUrl: "/",
      })) as SignInResponse | undefined;

      if (result?.error) {
        setError(result.error || "Invalid username or password");
      } else {
        router.push(result?.url ?? "/");
        router.refresh();
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-sm text-red-400">{error}</div>}

      <div>
        <label className={labelClassName} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          placeholder="jan.kowalski"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClassName}
          required
        />
      </div>

      <div>
        <label className={labelClassName} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClassName}
          required
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            className="rounded border-border text-[#30cfd0] focus:ring-[#30cfd0]/30"
          />
          Remember me
        </label>

        <button
          type="submit"
          className={cn(
            "ml-auto rounded-full px-5 py-2 text-sm font-semibold shadow transition hover:brightness-110 disabled:opacity-50",
            brandGradientBg,
          )}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
