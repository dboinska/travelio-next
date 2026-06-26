import Link from "next/link";
import { brandGradientText } from "@/lib/design/classes";
import { cn } from "@/lib/cn";

export const Logo = () => {
  return (
    <Link
      href="/"
      className={cn(
        "mr-6 text-sm font-semibold uppercase tracking-[0.4em]",
        brandGradientText,
      )}
    >
      Travelio.
    </Link>
  );
};
