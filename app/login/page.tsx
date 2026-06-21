import Link from "next/link";
import LoginForm from "../components/auth/LoginForm";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 rounded-2xl bg-linear-to-br from-black/40 to-black/20 p-1">
          <div className="flex flex-col md:flex-row bg-zinc-950 rounded-2xl overflow-hidden">
            <aside className="hidden md:flex w-1/2 items-center justify-center bg-linear-to-b from-blue-700 to-indigo-700 p-10 text-white">
              <div>
                <h2 className="text-3xl font-bold">Welcome back</h2>
                <p className="mt-3 text-sm text-white/90">
                  Log in to access your dashboard and manage your listings.
                </p>
              </div>
            </aside>

            <div className="w-full md:w-1/2 p-8">
              <h1 className="text-2xl font-bold text-white mb-4">Login</h1>
              <p className="mb-6 text-sm text-zinc-400">
                Use your account credentials to sign in.
              </p>

              <LoginForm />

              <p className="mt-6 text-sm text-zinc-400">
                Don&apos;t have an account?
                <Link href="/register" className="text-blue-400 underline">
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
