import Link from "next/link";
import { cn } from "@/lib/cn";
import { brandGradientBgAnimated } from "@/lib/design/classes";
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
    primary: cn(
      brandGradientBgAnimated,
      "hover:brightness-110",
    ),
    secondary:
      "border border-border bg-surface text-white/90 hover:border-white/20 hover:bg-surface/90",
    ghost: "text-slate-300 hover:text-white",
  };

  return <Link {...props} className={cn(base, variants[variant], className)} />;
}
