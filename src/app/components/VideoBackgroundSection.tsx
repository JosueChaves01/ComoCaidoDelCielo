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
  const scrollYProgressRef = useRef(motionValue(0));
  const wrapperTopRef = useRef(0);
  const wrapperHeightRef = useRef(0);
  const prevHiddenRef = useRef(false);
  const prevProgressRef = useRef(-1);
  const prevTimeRef = useRef(-1);
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
      videoRef.current.pause();
    }
  }, [reduceMotion]);

  // Cache wrapper dimensions — avoids layout-forcing reads in the rAF loop
  useEffect(() => {
    let frameId: number;

    const cache = () => {
      const w = wrapperRef.current;
      if (!w) return;
      const rect = w.getBoundingClientRect();
      wrapperTopRef.current = rect.top + window.scrollY;
      wrapperHeightRef.current = rect.height;
    };

    cache();

    const onResize = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(cache);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // rAF-based scroll tracking — zero layout-forcing reads
  useEffect(() => {
    if (reduceMotion) return;

    const video = videoRef.current;

    let rafId: number;
    let running = true;

    const tick = () => {
      if (!running) return;

      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;

      const denom = wrapperHeightRef.current - viewportH;
      const progress = denom > 0
        ? Math.max(0, Math.min(1, (scrollY - wrapperTopRef.current) / denom))
        : 0;

      if (progress !== prevProgressRef.current) {
        prevProgressRef.current = progress;
        scrollYProgressRef.current.set(progress);

        if (video && durationRef.current > 0) {
          const targetTime = progress * durationRef.current;
          if (Math.abs(targetTime - prevTimeRef.current) > 0.016) {
            prevTimeRef.current = targetTime;
            video.currentTime = targetTime;
          }
        }
      }

      const shouldHide = scrollY > wrapperTopRef.current + wrapperHeightRef.current;
      if (shouldHide !== prevHiddenRef.current) {
        prevHiddenRef.current = shouldHide;
        setHidden(shouldHide);
      }

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
          autoPlay
          preload="auto"
          poster={posterSrc}
          loop={reduceMotion ? true : undefined}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          style={{
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.5s ease",
            willChange: "transform",
          }}
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
