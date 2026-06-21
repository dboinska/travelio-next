import Link from "next/link";
import { cn } from "@/lib/cn";
import "./AppLink.css";

type AppLinkProps = React.ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function AppLink({
  className,
  variant = "primary",
  ...props
}: AppLinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#30cfd0] via-[#2a7de1] to-[#0c5eb6] bg-[length:200%_200%] animate-gradient-x transition hover:brightness-110 text-[#171717]",
    secondary:
      "border border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-900",
    ghost: "text-slate-200 hover:text-white",
  };

  return <Link {...props} className={cn(base, variants[variant], className)} />;
}
