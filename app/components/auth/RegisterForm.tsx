"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

      // after registration redirect to login or homepage
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
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      <div className="text-end">
        <button
          type="submit"
          className="rounded-full bg-linear-to-r from-green-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-95 disabled:opacity-50 transition"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </form>
  );
}
