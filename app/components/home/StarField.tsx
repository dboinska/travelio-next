import { heroStars } from "@/lib/home/starField";
import { cn } from "@/lib/cn";

export default function StarField() {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "[mask-image:radial-gradient(ellipse_95%_100%_at_50%_55%,black_8%,transparent_96%)]",
        "lg:[mask-image:radial-gradient(ellipse_88%_95%_at_72%_50%,black_6%,transparent_94%)]",
      )}
    >
      {heroStars.map((star) => (
        <span
          key={star.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            ["--star-delay" as string]: `${star.delay}s`,
            ["--star-duration" as string]: `${star.duration}s`,
            ["--star-opacity" as string]: star.peakOpacity,
          }}
        >
          <span
            className={cn(
              "relative block rounded-full bg-white",
              star.flare
                ? "hero-star-flare animate-star-flare"
                : "animate-star-twinkle shadow-[0_0_6px_rgba(255,255,255,0.45)]",
            )}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}
