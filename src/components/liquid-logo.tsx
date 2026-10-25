"use client";

export function LiquidLogo({ inverse = false }: { inverse?: boolean }) {
  return (
    <svg className={`liquid-logo${inverse ? " liquid-logo-inverse" : ""}`} viewBox="0 0 440 112" role="img" aria-labelledby="lch-logo-title" xmlns="http://www.w3.org/2000/svg">
      <title id="lch-logo-title">Light Creative — Brand, Print, Design</title>
      <g className="lch-mark" transform="translate(6 4)">
        <path d="M7 50C19 18 51 1 86 0L76 91C46 88 19 77 0 71Z" fill="currentColor"/>
        <path d="M94 1L184 17C175 55 146 82 86 92Z" fill="currentColor"/>
        <path d="M87 1L77 91" fill="none" stroke="#fff" strokeWidth="5.5"/>
        <path d="M25 57l3.1 6.3 7 .9-5.1 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5.1-4.9 7-.9z" fill="#fff"/>
        <path d="M160 27l3.1 6.3 7 .9-5.1 4.9 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5.1-4.9 7-.9z" fill="#fff"/>
      </g>
      <text x="206" y="56" fontFamily="Montserrat, Arial, sans-serif" fontSize="36" fontWeight="800" letterSpacing="-1.7" fill="currentColor">Light Creative</text>
      <text x="208" y="83" fontFamily="Montserrat, Arial, sans-serif" fontSize="15" fontWeight="800" letterSpacing=".2" fill="currentColor">BRAND <tspan fill="#0018A1">|</tspan> <tspan fill="#e58b2d">PRINT</tspan> <tspan fill="#0018A1">|</tspan> DESIGN</text>
    </svg>
  );
}
