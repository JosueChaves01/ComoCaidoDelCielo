"use client";

import {
  useRef,
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  useScroll,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

const SCRUB_THROTTLE_MS = 1000 / 30;

interface VideoBackgroundContextValue {
  scrollYProgress: MotionValue<number>;
}

const VideoBackgroundContext = createContext<VideoBackgroundContextValue | null>(null);

export function useVideoBackground(): VideoBackgroundContextValue {
  const ctx = useContext(VideoBackgroundContext);
  if (!ctx) {
    throw new Error("useVideoBackground must be used within VideoBackgroundSection");
  }
  return ctx;
}

interface VideoBackgroundSectionProps {
  videoSrc: string;
  children: ReactNode;
}

export function VideoBackgroundSection({ videoSrc, children }: VideoBackgroundSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const lastScrubRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const { scrollY } = useScroll();

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      durationRef.current = videoRef.current.duration;
      videoRef.current.currentTime = scrollYProgress.get() * durationRef.current;
    }
  }, [scrollYProgress]);

  // Scrubbing with throttle
  useEffect(() => {
    if (reduceMotion) return;

    const unsub = scrollYProgress.on("change", (v: number) => {
      const now = performance.now();
      if (now - lastScrubRef.current < SCRUB_THROTTLE_MS) return;
      lastScrubRef.current = now;

      if (videoRef.current && durationRef.current > 0) {
        videoRef.current.currentTime = v * durationRef.current;
      }
    });
    return unsub;
  }, [scrollYProgress, reduceMotion]);

  // Hide video only when wrapper is fully past viewport and next section fills the screen
  useEffect(() => {
    const unsub = scrollY.on("change", () => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      setHidden(rect.bottom <= -window.innerHeight);
    });
    return unsub;
  }, [scrollY]);

  // Cleanup video resources on unmount
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, []);

  return (
    <VideoBackgroundContext.Provider value={{ scrollYProgress }}>
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ visibility: hidden ? "hidden" : "visible" }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          autoPlay={reduceMotion ? true : undefined}
          loop={reduceMotion ? true : undefined}
          onLoadedMetadata={handleLoadedMetadata}
        >
          <source src={videoSrc.replace(/\.mp4$/, ".webm")} type="video/webm; codecs=vp9" />
          <source src={videoSrc} type="video/mp4; codecs=avc1" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/65 backdrop-saturate-150" />
        <div className="absolute inset-0 bg-[#0F0F23]/15" />
      </div>

      <div ref={wrapperRef} className="relative z-10">
        {children}
        <div className="h-[200vh]" />
      </div>
    </VideoBackgroundContext.Provider>
  );
}
