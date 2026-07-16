"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

type Props = {
  active: boolean;
};

export default function GlobeFrameloop({ active }: Props) {
  const setFrameloop = useThree((state) => state.setFrameloop);

  useEffect(() => {
    setFrameloop(active ? "always" : "never");
  }, [active, setFrameloop]);

  return null;
}
