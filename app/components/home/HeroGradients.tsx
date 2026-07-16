export default function HeroGradients() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Soft orbs only — no full-area radial washes (those read as a frame) */}
      <div className="absolute -left-24 top-[18%] h-80 w-80 rounded-full bg-[#30cfd0]/10 blur-[100px] sm:-left-16 lg:left-[4%] lg:top-[20%]" />
      <div className="absolute -right-20 top-[10%] h-96 w-96 rounded-full bg-[#0c5eb6]/10 blur-[110px] sm:-right-12 lg:right-[6%] lg:top-[14%]" />
      <div className="absolute right-[2%] -bottom-28 h-72 w-72 rounded-full bg-[#1a7fd4]/7 blur-[90px] lg:right-[10%] lg:bottom-20" />
    </div>
  );
}
