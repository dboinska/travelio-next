# Hero globe — inspiration and implementation

## Inspiration

Concept mockup for the Travelio home page (dark theme, 3D globe, flight routes, clouds, destination markers).

![Hero mockup](./hero-mockup.png)

## Implemented (Phase 1–2)

| Mockup element | Status | Files |
|---|---|---|
| Earth-textured globe | ✅ | `app/components/home/EarthGlobe.tsx` |
| Auto-rotation + mouse drag | ✅ | `GlobeCanvas.tsx` (`OrbitControls`) |
| Location markers | ✅ | `lib/globe/hotelsToGlobeData.ts` |
| Flight routes (arcs) | ✅ | `EarthGlobe.tsx`, `lib/globe/globeData.ts` |
| Cloud layer on the sphere | ✅ | `EarthGlobe.tsx` (spherical layers) |
| Hero layout (copy + globe) | ✅ | `app/components/home/HeroSection.tsx` |
| 3D island in foreground | ⏳ | planned later |
| Hotel card hover on marker | ⏳ | Phase 2 |
| Bloom / post-processing | ⏳ | Phase 3 |
| GSAP scroll between sections | ⏳ | Phase 3 |

## Stack

- `@react-three/fiber`, `@react-three/drei`, `three`, `three-globe`
- Data: Prisma (`geometry.coordinates`) → fallback `lib/globe/globeData.ts`

## Assets

- `public/textures/clouds.png` — equirectangular cloud map (three-globe / webgl-earth)
- Earth texture: three-globe CDN (`earth-blue-marble.jpg`)

## Component structure

```
HomePage
└── HeroSection
    ├── copy + CTA
    └── HeroGlobe (lazy, client)
        └── GlobeCanvas
            ├── EarthGlobe (three-globe + clouds)
            └── OrbitControls
```
