# Villa Saakadze — scroll-scrubbed hero

Next.js (App Router) + TypeScript + Tailwind.

## Setup

1. Copy `components/ScrollVideoHero.tsx` and `app/page.tsx` into your project.
2. Put the video at `public/videos/villa-saakadze.mp4`.
3. Tailwind ≥3.3 (arbitrary properties + `supports-[]` variants are used).

## How the scrub works

- The hero is a `trackLengthVh`-tall track (`400vh` default) with a sticky
  `100dvh` stage inside — the video stays pinned while you scroll the track.
- A single `requestAnimationFrame` loop maps track scroll progress (0–1) to
  `video.currentTime` (0–`duration`, read on `loadedmetadata`), with lerp
  smoothing. No `requestVideoFrameCallback` needed.
- The `<video>` is `muted playsInline preload="auto"`, never autoplays/loops,
  has no controls, and is `pointer-events-none` — it can't read as a player.

## Watermark cover

The source has a watermark in the top-right ~15% of the frame. Because the
video renders `object-fit: cover`, container percentages drift from frame
percentages as the frame crops — so `placeOverlay()` computes the displayed
frame rect from `videoWidth/videoHeight` and pins the "Villa Saakadze" lockup
(plus a feathered dark vignette) over that exact frame region, re-running on
resize. Holds at 1440 / 1024 / 768 / 390px.

## Encoding tip (important for smooth scrubbing)

Seek smoothness depends on keyframe density. Re-encode with a keyframe every
frame for buttery scrubbing:

```
ffmpeg -i in.mp4 -an -g 1 -crf 20 -movflags +faststart public/videos/villa-saakadze.mp4
```

(`-an` also strips the audio track — it's never used.)

## Mobile Safari

The sticky stage uses `h-screen` with a `100dvh` override where supported, so
the URL-bar collapse doesn't cause jumping or layout shift.
