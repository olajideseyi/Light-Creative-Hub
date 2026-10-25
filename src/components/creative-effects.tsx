"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.85 });
    let frame = 0;
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(frame); lenis.destroy(); };
  }, []);
  return null;
}

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const [effect, setEffect] = useState("fade-up");
  const [motionEnabled, setMotionEnabled] = useState(true);
  useEffect(() => {
    setEffect(document.body.dataset.scrollReveal || "fade-up");
    setMotionEnabled(document.body.dataset.motionEnabled !== "false");
  }, []);
  const disabled = Boolean(reduce) || !motionEnabled || effect === "none";
  const initial = effect === "fade" ? { opacity: 0 } : effect === "blur" ? { opacity: 0, filter: "blur(12px)" } : { opacity: 0, y: 28, filter: "blur(8px)" };
  const visible = { opacity: 1, y: 0, filter: "blur(0px)" };
  return <motion.div className={className} initial={disabled ? false : initial} whileInView={visible} viewport={{ once: true, amount: 0.16 }} transition={{ duration: disabled ? 0 : 0.72, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function PageIntro({ eyebrow, title, accent, description }: { eyebrow: string; title: string; accent: string; description: string }) {
  const reduce = useReducedMotion();
  return <div className="page-intro">
    <motion.p className="eyebrow" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>{eyebrow}</motion.p>
    <motion.h1 className="page-title" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>{title}<br/><em>{accent}</em></motion.h1>
    <motion.p className="page-description" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.24 }}>{description}</motion.p>
  </div>;
}
