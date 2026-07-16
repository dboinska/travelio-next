import Link from "next/link";
import LoginForm from "../components/auth/LoginForm";
import Navbar from "../components/Navbar";
import {
  authAsideClassName,
  authGlowClassName,
  authPanelClassName,
  linkAccentClassName,
} from "@/lib/design/classes";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div
          className={`grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl ${authPanelClassName}`}
        >
          <div className="flex flex-col md:flex-row">
            <aside className={authAsideClassName}>
              <div className={authGlowClassName} aria-hidden />
              <div className="relative">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                  Welcome back
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-wide text-white">
                  Sign in to Travelio
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                  Access your dashboard and manage your listings.
                </p>
              </div>
            </aside>

            <div className="w-full p-8 md:w-1/2">
              <h1 className="mb-4 text-2xl font-semibold tracking-wide text-white">
                Login
              </h1>
              <p className="mb-6 text-sm text-slate-400">
                Use your account credentials to sign in.
              </p>

              <LoginForm />

              <p className="mt-6 text-sm text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className={linkAccentClassName}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
