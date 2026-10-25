"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls, Sparkles } from "@react-three/drei";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import * as THREE from "three";

function LiquidForm() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.12;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.22} floatIntensity={0.6}>
      <mesh ref={mesh} scale={1.55}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial color="#8da0ff" roughness={0.12} metalness={0.32} distort={0.38} speed={1.35} envMapIntensity={1.4} />
      </mesh>
    </Float>
  );
}

export function LiquidWorld() {
  return <div className="liquid-world" aria-hidden="true">
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.7], fov: 42 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={3} color="#1d44ff" />
      <LiquidForm />
      <Sparkles count={42} scale={5.4} size={2.2} speed={0.22} opacity={0.7} color="#d7ff64" />
    </Canvas>
  </div>;
}

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
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(8px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: reduce ? 0 : 0.72, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

export function PageIntro({ eyebrow, title, accent, description }: { eyebrow: string; title: string; accent: string; description: string }) {
  const reduce = useReducedMotion();
  return <div className="page-intro">
    <motion.p className="eyebrow" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>{eyebrow}</motion.p>
    <motion.h1 className="page-title" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}>{title}<br/><em>{accent}</em></motion.h1>
    <motion.p className="page-description" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.24 }}>{description}</motion.p>
  </div>;
}
