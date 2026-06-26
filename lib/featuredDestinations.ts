export const featuredDestinations = [
  {
    title: "Tropical escape",
    region: "Southeast Asia",
    description:
      "Beachfront retreats with sea views and unhurried coastal living.",
    imageUrl:
      "https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?_gl=1*lt9dpr*_ga*MTA0MTMxNTE4My4xNzc5MzYzNzIw*_ga_8JE65Q40S6*czE3Nzk5MTE5NjkkbzIkZzEkdDE3Nzk5MTI0MzkkajMyJGwwJGgw",
    alt: "Tropical beach with palm trees",
  },
  {
    title: "City stays",
    region: "Urban Europe",
    description:
      "Design-led hotels in the heart of culture, dining and nightlife.",
    imageUrl: "https://images.pexels.com/photos/3716670/pexels-photo-3716670.jpeg",
    alt: "City skyline at dusk",
  },
  {
    title: "Mountain retreats",
    region: "Alpine & Nordic",
    description:
      "Quiet lodges framed by peaks, forest trails and clear mountain air.",
    imageUrl:
      "https://images.pexels.com/photos/31665649/pexels-photo-31665649.jpeg",
    alt: "Mountain lodge in the forest",
  },
] as const;

export type FeaturedDestination = (typeof featuredDestinations)[number];
