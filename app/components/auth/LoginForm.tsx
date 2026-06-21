"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, type SignInResponse } from "next-auth/react";

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
        <label
          className="block text-sm font-medium text-zinc-300 mb-2"
          htmlFor="username"
        >
          Username
        </label>
        <input
          id="username"
          name="username"
          placeholder="jan.kowalski"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium text-zinc-300 mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          required
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          Remember me
        </label>

        <button
          type="submit"
          className="ml-auto rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-50 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </form>
  );
}
