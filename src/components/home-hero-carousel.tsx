"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "@/app/home.module.css";

type CarouselSettings = {
  autoplay?: boolean;
  intervalSeconds?: number;
  transition?: "crossfade" | "slide" | "wipe" | "none";
  imageEffect?: "float" | "parallax" | "zoom" | "static";
  motionEnabled?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  overlayColor?: string;
  overlayStrength?: number;
};

export function HomeHeroCarousel({ images, fallbackImage, settings = {} }: { images: string[]; fallbackImage: string; settings?: CarouselSettings }) {
  const slides = useMemo(() => {
    const unique = Array.from(new Set(images.filter(Boolean)));
    return unique.length ? unique : [fallbackImage];
  }, [images, fallbackImage]);
  const [active, setActive] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const slideKey = slides.join("|");
  const intervalSeconds = Math.min(15, Math.max(2, Number(settings.intervalSeconds) || 3));
  const autoplay = settings.autoplay !== false && slides.length > 1 && !manualPause;
  const transition = settings.transition || "crossfade";
  const imageEffect = settings.motionEnabled === false ? "static" : (settings.imageEffect || "zoom");

  useEffect(() => {
    setActive(0);
    setManualPause(false);
  }, [slideKey]);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => setActive(current => (current + 1) % slides.length), intervalSeconds * 1000);
    return () => window.clearInterval(timer);
  }, [autoplay, intervalSeconds, slides.length]);

  function goTo(index: number) {
    setActive((index + slides.length) % slides.length);
    setManualPause(false);
  }

  const transitionClass = transition === "slide" ? styles.heroSlideSlide : transition === "wipe" ? styles.heroSlideWipe : transition === "none" ? styles.heroSlideNone : styles.heroSlideFade;
  const effectClass = imageEffect === "float" ? styles.heroSlideFloat : imageEffect === "parallax" ? styles.heroSlideParallax : imageEffect === "static" ? styles.heroSlideStatic : styles.heroSlideZoom;
  const showArrows = settings.showArrows !== false;
  const showDots = settings.showDots !== false;
  const overlayColor = /^#[0-9a-fA-F]{6}$/.test(settings.overlayColor || "") ? settings.overlayColor! : "#102f5b";
  const overlayStrength = Math.min(100, Math.max(0, Number(settings.overlayStrength ?? 82))) / 100;
  const overlayRgb = [1, 3, 5].map(offset => parseInt(overlayColor.slice(offset, offset + 2), 16)).join(",");
  const heroOverlayStyle = { background: `linear-gradient(90deg, rgba(${overlayRgb}, ${0.95 * overlayStrength}), rgba(${overlayRgb}, ${0.68 * overlayStrength}) 52%, rgba(${overlayRgb}, ${0.83 * overlayStrength})), linear-gradient(0deg, rgba(${overlayRgb}, ${0.42 * overlayStrength}), transparent 58%)` };

  return (
    <div className={styles.heroCarousel} aria-roledescription="carousel" aria-label="Light Creative Hub featured images">
      <div className={styles.heroSlideStage} aria-live="off">
        {slides.map((src, index) => <img key={src} className={[styles.heroSlide, transitionClass, effectClass, index === active ? styles.heroSlideActive : ""].filter(Boolean).join(" ")} src={src} alt="" aria-hidden="true" draggable={false} fetchPriority={index === 0 ? "high" : "auto"} />)}
      </div>
      <div className={styles.heroShade} style={heroOverlayStyle} />
      {slides.length > 1 && <div className={styles.heroSlideControls}>
        {showArrows && <button type="button" className={styles.heroSlideArrow} onClick={() => goTo(active - 1)} aria-label="Previous hero image">←</button>}
        {showDots && <div className={styles.heroSlideDots} aria-label="Choose hero image">{slides.map((src, index) => <button key={src} type="button" className={styles.heroSlideDot + " " + (index === active ? styles.heroSlideDotActive : "")} aria-label={"Show hero image " + (index + 1)} aria-pressed={index === active} onClick={() => goTo(index)} />)}</div>}
        {showArrows && <button type="button" className={styles.heroSlideArrow} onClick={() => goTo(active + 1)} aria-label="Next hero image">→</button>}
        <button type="button" className={styles.heroSlidePause} onClick={() => setManualPause(value => !value)} aria-label={manualPause ? "Resume automatic image rotation" : "Pause automatic image rotation"} aria-pressed={manualPause}>{manualPause ? "PLAY" : "PAUSE"}</button>
        <span className={styles.heroSlideCount}>{String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
      </div>}
    </div>
  );
}
