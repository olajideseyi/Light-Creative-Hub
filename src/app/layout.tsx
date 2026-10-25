import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Light Creative Hub | Design. Print. Create.", description: "Creative design, branding, printing, photography, videography, and content production for businesses and individuals.", applicationName: "Light Creative Hub" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><a className="brand" href="/">LIGHT<span>CREATIVE HUB</span></a><nav><a href="/services">Services</a><a href="/portfolio">Our work</a><a href="/contact">Contact</a></nav><a className="nav-cta" href="https://wa.me/2347067376478">Let’s talk ↗</a></header><main id="main">{children}</main><footer className="footer"><a className="brand" href="/">LIGHT<span>CREATIVE HUB</span></a><p>Creative ideas. Professional execution.</p><p>07067376478 · lightcreativehub0@gmail.com</p><small>© {new Date().getFullYear()} Light Creative Hub. All rights reserved.</small></footer></body></html>;
}
