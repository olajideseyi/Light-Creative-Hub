"use client";

export function LiquidLogo({ inverse = false }: { inverse?: boolean }) {
  return <svg className={`liquid-logo${inverse ? " liquid-logo-inverse" : ""}`} viewBox="0 0 330 70" role="img" aria-labelledby="lch-logo-title" xmlns="http://www.w3.org/2000/svg">
    <title id="lch-logo-title">Light Creative Hub — Brand, Print, Design</title>
    <defs>
      <filter id="lch-liquid-distort" x="-8%" y="-20%" width="116%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency=".012 .025" numOctaves="2" seed="8" result="noise">
          <animate attributeName="baseFrequency" values=".012 .025;.018 .04;.012 .025" dur="5s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G">
          <animate attributeName="scale" values="0;1.8;0" dur="5s" repeatCount="indefinite" />
        </feDisplacementMap>
      </filter>
    </defs>
    <g className="liquid-logo-art" filter="url(#lch-liquid-distort)" fill="currentColor">
      <path d="M3 7h9v43h26v8H3z" />
      <path d="M43 7h9v51h-9z" />
      <path d="M60 7h9v51h-9z" />
      <path d="M77 7h9v51h-9z" />
      <path d="M60 7h26v8H60zM60 28h23v8H60zM60 50h26v8H60z" />
      <text x="99" y="27" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="800" letterSpacing="-.6">LIGHT CREATIVE</text>
      <text x="100" y="47" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" letterSpacing="2.5">HUB</text>
      <text x="100" y="61" fontFamily="Arial, sans-serif" fontSize="6.4" fontWeight="700" letterSpacing="1.35">BRAND  |  PRINT  |  DESIGN</text>
    </g>
  </svg>;
}
