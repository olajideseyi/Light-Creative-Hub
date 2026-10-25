import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Light Creative Hub | Design. Print. Create.", template: "%s | Light Creative Hub" },
  description: "Creative design, branding, printing, photography, videography, and content production for businesses and individuals.",
  applicationName: "Light Creative Hub"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="site-header">
          <a className="brand-logo" href="/" aria-label="Light Creative Hub home"><img src="/brand/light-creative-hub-mark.svg" alt="Light Creative Hub — Brand, Print, Design" /></a>
          <nav aria-label="Main navigation">
            <a href="/about">About</a><a href="/services">Services</a><a href="/portfolio">Our work</a><a href="/contact">Contact</a>
          </nav>
          <a className="nav-cta" href="/request-a-quote">Start a project ↗</a>
        </header>
        <main id="main">{children}</main>
        <footer className="footer">
          <a className="brand-logo footer-logo" href="/" aria-label="Light Creative Hub home"><img src="/brand/light-creative-hub-mark.svg" alt="" /></a>
          <p>Creative ideas. Professional execution.</p>
          <div className="footer-contacts"><a href="tel:+2347067376478">07067376478</a><a href="tel:+2349045218491">09045218491</a><a href="mailto:lightcreativehub0@gmail.com">lightcreativehub0@gmail.com</a></div>
          <div className="footer-nav"><a href="/privacy">Privacy</a><a href="/services">Services</a><a href="/portfolio">Portfolio</a></div>
          <small>© {new Date().getFullYear()} Light Creative Hub. All rights reserved.</small>
        </footer>
      </body>
    </html>
  );
}
