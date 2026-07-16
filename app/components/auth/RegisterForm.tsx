"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { brandGradientBg, inputClassName, labelClassName } from "@/lib/design/classes";
import { cn } from "@/lib/cn";

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body?.message || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/login");
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
        <label className={labelClassName} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <div className="text-end">
        <button
          type="submit"
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold shadow transition hover:brightness-110 disabled:opacity-50",
            brandGradientBg,
          )}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
}
