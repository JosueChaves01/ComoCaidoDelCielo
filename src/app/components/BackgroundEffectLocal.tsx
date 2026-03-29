import React, { useEffect, useRef } from "react";
import "../../styles/background.css";

interface Props {
  sectionRef?: React.RefObject<HTMLElement>;
}

export default function BackgroundEffectLocal({ sectionRef }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const starsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current!;
    const starsContainer = starsRef.current!;

    // Generate stars
    const STAR_COUNT = 80; // fewer for section

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement("div");
      star.className = "bg-star";

      star.style.top = Math.random() * 100 + "%";
      star.style.left = Math.random() * 100 + "%";

      const size = Math.random() > 0.85 ? 2 : 1;
      star.style.width = size + "px";
      star.style.height = size + "px";

      star.style.animationDelay = (Math.random() * 2) + "s";

      starsContainer.appendChild(star);
    }

    // Apply the gradient directly to the section element so it's always visible behind content
    const parentEl = (sectionRef && sectionRef.current) ? sectionRef.current : starsContainer.closest("section");
    const gradientCss = "linear-gradient(to bottom, #7EC8FF 0%, #FFD08A 30%, #f8a03bff 60%, #08082cff 80%, #000000ff 100%)";
    if (parentEl) {
      (parentEl as HTMLElement).style.backgroundImage = gradientCss;
      (parentEl as HTMLElement).style.backgroundRepeat = "no-repeat";
      (parentEl as HTMLElement).style.backgroundSize = "cover";
    }

    // Scroll logic — local to the section using provided ref or closest section
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const parent = (sectionRef && sectionRef.current) ? sectionRef.current : starsContainer.closest("section");
          if (!parent) return;

          const rect = (parent as HTMLElement).getBoundingClientRect();

          // Calculate progress based on how much of the section is visible in the viewport
          const viewHeight = window.innerHeight || document.documentElement.clientHeight;
          const sectionHeight = rect.height || 1;

          // visibleHeight is the intersection between the section and the viewport
          const visibleTop = Math.max(rect.top, 0);
          const visibleBottom = Math.min(rect.bottom, viewHeight);
          const visibleHeight = Math.max(visibleBottom - visibleTop, 0);

          const progress = Math.min(Math.max(visibleHeight / sectionHeight, 0), 1);

          // Darkness based on section progress
          const darkness = Math.min(progress * 0.95, 0.95);
          overlay.style.opacity = String(darkness);

          // Stars appear once a portion of the section is visible
          let starsOpacity = 0;
          if (progress > 0.12) {
            starsOpacity = (progress - 0.12) / (1 - 0.12);
          }
          starsContainer.style.opacity = String(Math.min(Math.max(starsOpacity, 0), 1));

          // For debugging - temporarily outline the background container when visible
          // (removed in production)
          // if (progress > 0) {
          //   starsContainer.style.outline = "2px solid rgba(255,0,0,0.2)";
          // } else {
          //   starsContainer.style.outline = "";
          // }

          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // initial
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      while (starsContainer.firstChild) starsContainer.removeChild(starsContainer.firstChild);
      // cleanup applied background
      const parentElCleanup = (sectionRef && sectionRef.current) ? sectionRef.current : starsContainer.closest("section");
      if (parentElCleanup) {
        (parentElCleanup as HTMLElement).style.backgroundImage = "";
        (parentElCleanup as HTMLElement).style.backgroundRepeat = "";
        (parentElCleanup as HTMLElement).style.backgroundSize = "";
      }
    };
  }, [sectionRef]);

  return (
    <div className="site-background-local" aria-hidden>
      <div className="bg-overlay" ref={overlayRef} />
      <div className="bg-stars" ref={starsRef} />
    </div>
  );
}
