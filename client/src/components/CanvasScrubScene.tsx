/*
  Design philosophy: pear.no-style cinematic canvas motion.
  The canvas is deliberately fail-safe: it never clears until a complete frame
  is ready, never blends an undecoded neighbor, and keeps its last valid image
  visible during scroll handoffs.
*/
import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  frames: readonly string[];
  frameIndex: number;
  className?: string;
  style?: CSSProperties;
};

type CachedImage = {
  image: HTMLImageElement;
  ready: boolean;
  failed: boolean;
};

const imageCache = new Map<string, CachedImage>();

function cachedImage(src: string) {
  const existing = imageCache.get(src);
  if (existing) return existing;
  const image = new Image();
  const record: CachedImage = { image, ready: false, failed: false };
  image.decoding = "async";
  image.loading = "eager";
  image.onload = () => { record.ready = true; };
  image.onerror = () => { record.failed = true; };
  image.src = src;
  imageCache.set(src, record);
  return record;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export default function CanvasScrubScene({ frames, frameIndex, className = "", style }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetRef = useRef(frameIndex);
  const currentRef = useRef(frameIndex);
  const lastDrawnRef = useRef(frameIndex);
  const primedCenterRef = useRef(-1);

  useEffect(() => {
    targetRef.current = clamp(frameIndex, 0, Math.max(0, frames.length - 1));
  }, [frameIndex, frames.length]);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true, desynchronized: true });
    if (!canvas || !context || frames.length === 0) return () => { cancelled = true; };

    const primeAround = (center: number) => {
      const safeCenter = Math.round(clamp(center, 0, frames.length - 1));
      if (safeCenter === primedCenterRef.current) return;
      primedCenterRef.current = safeCenter;
      for (let offset = -12; offset <= 12; offset += 1) {
        const index = safeCenter + offset;
        if (index >= 0 && index < frames.length) cachedImage(frames[index]);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);
      if (canvas.width === pixelWidth && canvas.height === pixelHeight) return;
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawCover = (record: CachedImage, alpha: number, drift: number) => {
      if (!record.ready || record.failed || !record.image.naturalWidth) return false;
      const width = canvas.clientWidth || canvas.getBoundingClientRect().width;
      const height = canvas.clientHeight || canvas.getBoundingClientRect().height;
      if (!width || !height) return false;
      const scale = Math.max(width / record.image.naturalWidth, height / record.image.naturalHeight);
      const drawWidth = record.image.naturalWidth * scale;
      const drawHeight = record.image.naturalHeight * scale;
      context.globalAlpha = alpha;
      context.drawImage(record.image, (width - drawWidth) / 2 + drift, (height - drawHeight) / 2 - drift * 0.24, drawWidth, drawHeight);
      return true;
    };

    resize();
    primeAround(targetRef.current);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    let raf = 0;

    const render = () => {
      if (cancelled) return;
      const target = clamp(targetRef.current, 0, frames.length - 1);
      const distance = target - currentRef.current;
      currentRef.current = Math.abs(distance) < 0.015 ? target : currentRef.current + distance * 0.2;
      primeAround(currentRef.current);

      const floor = Math.floor(currentRef.current);
      const next = Math.min(frames.length - 1, floor + 1);
      const blend = currentRef.current - floor;
      const drift = (currentRef.current / Math.max(1, frames.length - 1) - 0.5) * 18;
      const first = cachedImage(frames[floor]);
      const second = cachedImage(frames[next]);
      const bothReady = first.ready && !first.failed && second.ready && !second.failed;
      const firstReady = first.ready && !first.failed;
      const secondReady = second.ready && !second.failed;

      // Do not clear or partially blend when a target frame is still decoding.
      // The previous complete canvas stays visible until a complete replacement is ready.
      if (bothReady || firstReady || secondReady) {
        const width = canvas.clientWidth || canvas.getBoundingClientRect().width;
        const height = canvas.clientHeight || canvas.getBoundingClientRect().height;
        context.globalAlpha = 1;
        context.globalCompositeOperation = "source-over";
        context.clearRect(0, 0, width, height);
        if (bothReady) {
          drawCover(first, 1 - blend, drift);
          drawCover(second, blend, drift);
          lastDrawnRef.current = blend < 0.5 ? floor : next;
        } else if (firstReady) {
          drawCover(first, 1, drift);
          lastDrawnRef.current = floor;
        } else {
          drawCover(second, 1, drift);
          lastDrawnRef.current = next;
        }
        context.globalAlpha = 1;
      } else {
        // Intentionally do nothing: preserve the last fully painted frame.
        void lastDrawnRef.current;
      }

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
    };
  }, [frames]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        ...style,
        backgroundImage: `url("${frames[0]}")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      aria-hidden="true"
    />
  );
}
