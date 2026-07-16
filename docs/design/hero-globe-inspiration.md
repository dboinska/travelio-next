# Hero glob — inspiracja i implementacja

## Inspiracja

Mockup koncepcyjny strony głównej Travelio (ciemny motyw, glob 3D, trasy lotów, chmury, markery destynacji).

![Mockup hero](./hero-mockup.png)

## Co zaimplementowano (Faza 1–2)

| Element z mockupu | Status | Pliki |
|---|---|---|
| Glob z teksturą Ziemi | ✅ | `app/components/home/EarthGlobe.tsx` |
| Auto-rotacja + obrót myszą | ✅ | `GlobeCanvas.tsx` (`OrbitControls`) |
| Markery lokalizacji | ✅ | `lib/globe/hotelsToGlobeData.ts` |
| Trasy lotnicze (łuki) | ✅ | `EarthGlobe.tsx`, `lib/globe/globeData.ts` |
| Chmury dopasowane do kuli | ✅ | `EarthGlobe.tsx` (warstwy sferyczne) |
| Hero layout (tekst + glob) | ✅ | `app/components/home/HeroSection.tsx` |
| Wyspa 3D w foreground | ⏳ | planowane później |
| Hover karty hotelu na markerze | ⏳ | Faza 2 |
| Bloom / post-processing | ⏳ | Faza 3 |
| GSAP scroll między sekcjami | ⏳ | Faza 3 |

## Stack

- `@react-three/fiber`, `@react-three/drei`, `three`, `three-globe`
- Dane: Prisma (`geometry.coordinates`) → fallback `lib/globe/globeData.ts`

## Assety

- `public/textures/clouds.png` — mapa chmur equirectangular (three-globe / webgl-earth)
- Tekstura Ziemi: CDN three-globe (`earth-blue-marble.jpg`)

## Struktura komponentów

```
HomePage
└── HeroSection
    ├── copy + CTA
    └── HeroGlobe (lazy, client)
        └── GlobeCanvas
            ├── EarthGlobe (three-globe + chmury)
            └── OrbitControls
```
