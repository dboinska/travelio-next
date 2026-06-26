export type HeroStar = {
  id: number;
  left: number;
  top: number;
  size: number;
  peakOpacity: number;
  delay: number;
  duration: number;
  flare: boolean;
};

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function buildStar(id: number, biasRight: boolean): HeroStar {
  const leftSeed = seededRandom(id * 4 + 1);
  const topSeed = seededRandom(id * 4 + 2);
  const sizeSeed = seededRandom(id * 4 + 3);
  const flareSeed = seededRandom(id * 17);

  const left = biasRight ? 38 + leftSeed * 62 : leftSeed * 100;
  const top = topSeed * 100;

  return {
    id,
    left,
    top,
    size: sizeSeed > 0.92 ? 3 : sizeSeed > 0.72 ? 2.25 : sizeSeed > 0.45 ? 1.5 : 1,
    peakOpacity: 0.6 + seededRandom(id * 9) * 0.4,
    delay: seededRandom(id * 11) * 10,
    duration: 2.8 + seededRandom(id * 13) * 5,
    flare: flareSeed > 0.965,
  };
}

/** Deterministic star positions — stable between SSR and client. */
export const heroStars: HeroStar[] = [
  ...Array.from({ length: 45 }, (_, id) => buildStar(id, false)),
  ...Array.from({ length: 95 }, (_, id) => buildStar(id + 45, true)),
];
