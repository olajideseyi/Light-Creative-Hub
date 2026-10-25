"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function ShaderGradient() {
  const material = useRef<THREE.ShaderMaterial>(null);
  useFrame((state) => {
    if (material.current) material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return <mesh position={[0, 0, -2.4]} scale={[5.5, 4.2, 1]}>
    <planeGeometry args={[1, 1, 1, 1]} />
    <shaderMaterial
      ref={material}
      transparent
      uniforms={{ uTime: { value: 0 } }}
      vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
      fragmentShader={`varying vec2 vUv; uniform float uTime; void main(){ vec2 uv=vUv; float wave=sin(uv.x*5.0+uTime*.18)*.08+cos(uv.y*4.0-uTime*.14)*.06; vec3 a=vec3(.0,.035,.36); vec3 b=vec3(.03,.10,.72); vec3 c=vec3(.28,.34,1.0); float g=smoothstep(.0,1.0,uv.y+wave); vec3 col=mix(a,b,g); col=mix(col,c,smoothstep(.45,1.0,uv.x+wave)*.48); float glow=exp(-distance(uv,vec2(.68,.55))*3.2); col+=vec3(.10,.14,.40)*glow; gl_FragColor=vec4(col, .28); }`}
    />
  </mesh>;
}

function LiquidForm() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.y += delta * 0.12;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.12;
  });
  return <Float speed={1.1} rotationIntensity={0.22} floatIntensity={0.6}>
    <mesh ref={mesh} scale={1.55}>
      <icosahedronGeometry args={[1, 32]} />
      <MeshDistortMaterial color="#8da0ff" roughness={0.12} metalness={0.32} distort={0.38} speed={1.35} envMapIntensity={1.4} />
    </mesh>
  </Float>;
}

export function LiquidWorld() {
  return <div className="liquid-world" aria-hidden="true">
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.7], fov: 42 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={3} color="#1d44ff" />
      <ShaderGradient />
      <LiquidForm />
      <Sparkles count={42} scale={5.4} size={2.2} speed={0.22} opacity={0.7} color="#d7ff64" />
    </Canvas>
  </div>;
}
