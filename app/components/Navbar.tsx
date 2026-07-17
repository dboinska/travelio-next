"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "./Logo";
import { AppLink } from "./AppLink";

export default function Navbar() {
  const { data: session, status } = useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex row gap-2">
          <Logo />
          <nav className="flex items-center gap-6 text-sm text-slate-300">
            <Link className="transition hover:text-white" href="/hotels">
              Hotels
            </Link>

            <Link className="transition hover:text-white" href="/about">
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="text-sm text-slate-400">Loading...</div>
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                aria-label="Open user menu"
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 transition hover:bg-surface/80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || user.email || "User",
                    )}&background=27272a&color=f8fafc&rounded=true&size=64`
                  }
                  alt={user.name || "User avatar"}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="hidden flex-col text-right sm:flex">
                  <span className="text-sm font-semibold text-white">
                    {user.name || user.email}
                  </span>
                </div>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 rounded border border-border bg-surface p-1 shadow-lg">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full rounded px-3 py-2 text-left text-sm text-white hover:bg-background"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <AppLink href={"/login"} variant="secondary">
                Login
              </AppLink>
              <AppLink href={"/register"}>Register</AppLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
