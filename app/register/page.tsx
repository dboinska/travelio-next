import Link from "next/link";
import RegisterForm from "../components/auth/RegisterForm";
import Navbar from "../components/Navbar";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 rounded-2xl bg-linear-to-br from-black/40 to-black/20 p-1">
          <div className="flex flex-col md:flex-row bg-zinc-950 rounded-2xl overflow-hidden">
            <div className="w-full md:w-1/2 p-8">
              <h1 className="text-2xl font-bold text-white mb-4">
                Create account
              </h1>
              <p className="mb-6 text-sm text-zinc-400">
                Create your account to start listing and managing hotels.
              </p>

              <RegisterForm />

              <p className="mt-6 text-sm text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 underline">
                  Sign in
                </Link>
              </p>
            </div>

            <aside className="hidden md:flex w-1/2 items-center justify-center bg-linear-to-b from-green-600 to-teal-500 p-10 text-white">
              <div>
                <h2 className="text-3xl font-bold">Join us</h2>
                <p className="mt-3 text-sm text-white/90">
                  Create an account to list your hotels and reach more guests.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
