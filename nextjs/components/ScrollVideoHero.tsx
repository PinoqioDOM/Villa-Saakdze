"use client";

import { useEffect, useRef } from "react";

type ScrollVideoHeroProps = {
  /** Video source, e.g. "/videos/villa-saakadze.mp4" (place file in /public/videos/). */
  src: string;
  /** Total scroll distance, in viewport-heights, mapped onto the full video duration. */
  trackLengthVh?: number;
  /** 0–1 lerp factor per frame; higher = snappier scrub, lower = floatier. */
  smoothing?: number;
  /** Text lockup that covers the source watermark in the top-right of the frame. */
  brandMark?: string;
};

/**
 * Apple-style scroll-scrubbed hero.
 *
 * A tall "scroll track" (trackLengthVh) wraps a sticky 100dvh stage. As the
 * user scrolls through the track, scroll progress (0–1) is mapped to
 * video.currentTime (0–duration) inside a requestAnimationFrame loop, with
 * light lerp smoothing. No requestVideoFrameCallback dependency — works
 * everywhere <video> does. The video never autoplays, loops, or accepts
 * pointer input, so it reads as a scroll-driven scene, not a media player.
 */
export default function ScrollVideoHero({
  src,
  trackLengthVh = 400,
  smoothing = 0.18,
  brandMark = "Villa Saakadze",
}: ScrollVideoHeroProps) {
  const trackRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef(0);
  const currentRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const track = trackRef.current;
    if (!video || !track) return;

    let raf = 0;

    /**
     * The video renders with object-fit: cover, so container percentages do
     * NOT match source-frame percentages once the frame is cropped. Compute
     * the displayed frame rect and pin the brand overlay over the top-right
     * ~15% of the SOURCE frame (where the watermark lives), clamped to the
     * viewport. Re-runs on resize, so it holds at 1440 / 1024 / 768 / 390px.
     */
    const placeOverlay = () => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const cw = video.clientWidth;
      const ch = video.clientHeight;
      const fw = video.videoWidth || 16;
      const fh = video.videoHeight || 9;
      const scale = Math.max(cw / fw, ch / fh); // object-fit: cover
      const dw = fw * scale;
      const dh = fh * scale;
      const ox = (cw - dw) / 2;
      const oy = (ch - dh) / 2;
      const left = Math.max(0, ox + dw * 0.74);
      const top = Math.max(0, oy);
      const right = Math.min(cw, ox + dw);
      const bottom = Math.min(ch, oy + dh * 0.19);
      overlay.style.right = "auto";
      overlay.style.left = `${left}px`;
      overlay.style.top = `${top}px`;
      overlay.style.width = `${Math.max(0, right - left)}px`;
      overlay.style.height = `${Math.max(0, bottom - top)}px`;
    };

    const onMeta = () => {
      durationRef.current = video.duration || 0;
      try {
        video.currentTime = 0.001; // nudge so the first frame paints (Safari)
      } catch {
        /* not seekable yet — first tick will handle it */
      }
      placeOverlay();
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!durationRef.current) return;
      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const progress =
        span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      const target = progress * Math.max(0, durationRef.current - 0.05);
      currentRef.current += (target - currentRef.current) * smoothing;
      if (Math.abs(target - currentRef.current) < 0.003) {
        currentRef.current = target;
      }
      if (
        video.seekable.length > 0 &&
        Math.abs(video.currentTime - currentRef.current) > 0.002
      ) {
        video.currentTime = currentRef.current;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = progress < 0.03 ? "1" : "0";
      }
    };

    video.addEventListener("loadedmetadata", onMeta);
    if (video.readyState >= 1) onMeta();
    window.addEventListener("resize", placeOverlay);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("resize", placeOverlay);
    };
  }, [smoothing]);

  return (
    <section
      ref={trackRef}
      aria-label="Villa Saakadze"
      className="relative"
      style={{ height: `${trackLengthVh}vh` }}
    >
      {/* h-screen fallback first, then 100dvh where supported (mobile Safari) */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#1e1813] supports-[height:100dvh]:h-[100dvh]">
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        />

        {/* Brand mark — sits exactly over the source watermark region */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute right-0 top-0 flex h-[16%] min-h-[90px] w-[26%] min-w-[230px] items-center justify-center"
        >
          {/* Feathered corner vignette obscures the watermark and reads as grade, not UI */}
          <div className="absolute -inset-[45%] bg-[radial-gradient(ellipse_at_66%_46%,rgba(20,15,10,0.96)_0%,rgba(20,15,10,0.62)_44%,rgba(20,15,10,0)_72%)]" />
          <span className="relative whitespace-nowrap italic tracking-[0.08em] text-[#d9c49b]/95 [font-family:var(--font-display),Georgia,serif] [font-size:clamp(17px,1.9vw,29px)] [text-shadow:0_1px_10px_rgba(0,0,0,0.6),0_0_28px_rgba(0,0,0,0.4)]">
            {brandMark}
          </span>
        </div>

        {/* Scroll cue — fades as soon as scrubbing begins */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center transition-opacity duration-700"
        >
          <span className="text-[11px] uppercase tracking-[0.42em] text-[#f0e6d6]/75 [font-family:var(--font-body),sans-serif] [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
