import Link from "next/link";
import RegisterForm from "../components/auth/RegisterForm";
import Navbar from "../components/Navbar";
import {
  authAsideClassName,
  authGlowClassName,
  authPanelClassName,
  linkAccentClassName,
} from "@/lib/design/classes";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[80vh] items-center justify-center px-4 py-12">
        <div
          className={`grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl ${authPanelClassName}`}
        >
          <div className="flex flex-col md:flex-row">
            <div className="w-full p-8 md:w-1/2">
              <h1 className="mb-4 text-2xl font-semibold tracking-wide text-white">
                Create account
              </h1>
              <p className="mb-6 text-sm text-slate-400">
                Create your account to start listing and managing hotels.
              </p>

              <RegisterForm />

              <p className="mt-6 text-sm text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className={linkAccentClassName}>
                  Sign in
                </Link>
              </p>
            </div>

            <aside className={authAsideClassName}>
              <div className={authGlowClassName} aria-hidden />
              <div className="relative">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
                  Join Travelio
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-wide text-white">
                  List your stay
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
                  Reach travelers exploring destinations on the globe.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
