/** Travelio — brand gradient (#30cfd0 → #0c5eb6), neutral gray surfaces. */

export const brandGradientText =
  "bg-gradient-to-r from-[#30cfd0] to-[#0c5eb6] bg-clip-text text-transparent";

export const brandGradientBg =
  "bg-gradient-to-r from-[#30cfd0] to-[#0c5eb6] text-slate-950";

export const brandGradientBgAnimated =
  "bg-gradient-to-r from-[#30cfd0] via-[#30cfd0] to-[#0c5eb6] bg-[length:200%_200%] animate-gradient-x text-slate-950";

export const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white placeholder-muted outline-none transition focus:border-[#30cfd0]/50 focus:ring-1 focus:ring-[#30cfd0]/20";

export const labelClassName = "mb-2 block text-sm font-medium text-white/80";

export const cardClassName =
  "rounded-2xl border border-border bg-surface/80 backdrop-blur-sm";

export const cardInteractiveClassName =
  "rounded-2xl border border-border bg-surface/80 backdrop-blur-sm transition duration-300 hover:border-white/20 hover:bg-surface";

export const linkAccentClassName =
  "text-[#30cfd0] underline decoration-[#30cfd0]/30 underline-offset-4 transition hover:text-[#30cfd0]/80";

export const authPanelClassName =
  "relative overflow-hidden border border-border bg-background";

export const authAsideClassName =
  "relative hidden w-1/2 flex-col justify-center overflow-hidden border-r border-border bg-surface p-10 md:flex";

export const authGlowClassName =
  "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_18%,rgba(48,207,208,0.14),transparent_52%)]";

export const paginationActiveClassName = brandGradientBg;

export const paginationIdleClassName =
  "border border-border text-muted hover:border-white/20 hover:text-white";
