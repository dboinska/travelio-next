"use client";

import { useEffect, useState, type RefObject } from "react";

/** Pause heavy WebGL work when the globe is off-screen or the tab is hidden. */
export function useGlobeActive(targetRef: RefObject<Element | null>) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    let tabVisible = document.visibilityState === "visible";
    let inView = true;

    const sync = () => setActive(tabVisible && inView);

    const onVisibility = () => {
      tabVisible = document.visibilityState === "visible";
      sync();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px", threshold: 0 },
    );

    observer.observe(element);
    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [targetRef]);

  return active;
}
