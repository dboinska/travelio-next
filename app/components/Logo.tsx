import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="text-sm uppercase tracking-[0.4em] font-semibold bg-gradient-to-r mr-6 from-[#30cfd0] to-[#0c5eb6] bg-clip-text text-transparent"
    >
      Travelio.
    </Link>
  );
};
