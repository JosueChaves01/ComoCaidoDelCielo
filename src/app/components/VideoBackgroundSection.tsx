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
  useReducedMotion,
  motionValue,
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
  posterSrc?: string;
  children: ReactNode;
}

export function VideoBackgroundSection({ videoSrc, posterSrc, children }: VideoBackgroundSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(0);
  const lastScrubRef = useRef(0);
  const scrollYProgressRef = useRef(motionValue(0));
  const reduceMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      durationRef.current = videoRef.current.duration;
      videoRef.current.currentTime = scrollYProgressRef.current.get() * durationRef.current;
    }
  }, []);

  const handleCanPlay = useCallback(() => {
    setVideoReady(true);
    if (videoRef.current && !reduceMotion) {
      videoRef.current.play().then(() => {
        videoRef.current?.pause();
      }).catch(() => {});
    }
  }, [reduceMotion]);

  // rAF-based scroll tracking — works during iOS momentum scrolling
  useEffect(() => {
    if (reduceMotion) return;

    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper) return;

    let rafId: number;
    let running = true;

    const tick = () => {
      if (!running) return;

      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = wrapper.offsetHeight;
      const viewportH = window.innerHeight;

      const denom = wrapperHeight - viewportH;
      const progress = denom > 0
        ? Math.max(0, Math.min(1, -rect.top / denom))
        : 0;

      scrollYProgressRef.current.set(progress);

      const now = performance.now();
      if (video && durationRef.current > 0 && now - lastScrubRef.current >= SCRUB_THROTTLE_MS) {
        lastScrubRef.current = now;
        video.currentTime = progress * durationRef.current;
      }

      setHidden(rect.bottom <= -viewportH);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

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
    <VideoBackgroundContext.Provider value={{ scrollYProgress: scrollYProgressRef.current }}>
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ visibility: hidden ? "hidden" : "visible" }}
      >
        {posterSrc && !videoReady && (
          <img
            src={posterSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          poster={posterSrc}
          loop={reduceMotion ? true : undefined}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          style={{ opacity: videoReady ? 1 : 0, transition: "opacity 0.5s ease" }}
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
