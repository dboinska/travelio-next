import Link from "next/link";
import { Logo } from "./Logo";
import { AppLink } from "./AppLink";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 backdrop-blur">
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
        <div className="flex row gap-2">
          <AppLink href={"/login"} variant="secondary">
            Login
          </AppLink>
          <AppLink href={"/register"}>Register</AppLink>
        </div>
      </div>
    </header>
  );
}
