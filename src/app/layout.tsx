import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/creative-effects";
import { LiquidLogo } from "@/components/liquid-logo";
import { WhatsAppFloat, WhatsAppLink } from "@/components/whatsapp-float";
import { getSiteContact } from "@/lib/site-contact";
import { MobileNav } from "@/components/mobile-nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://light-creative-hub.vercel.app"),
  title: { default: "Light Creative Hub | Design. Print. Create.", template: "%s | Light Creative Hub" },
  description: "Creative design, branding, printing, photography, videography, and content production for businesses and individuals.",
  applicationName: "Light Creative Hub",
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  openGraph: { title: "Light Creative Hub | Brand · Print · Design", description: "Brand identity, graphic design, print, photography and video content.", type: "website" }
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const contact = await getSiteContact();
  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="site-header">
          <a className="brand-logo" href="/" aria-label="Light Creative Hub home"><LiquidLogo /></a>
          <MobileNav />
          <WhatsAppLink className="header-whatsapp"><span className="header-wa-dot" aria-hidden="true">↗</span> WhatsApp</WhatsAppLink><a className="nav-cta" href="/request-a-quote">Start a project ↗</a>
        </header>
        <main id="main">{children}</main>
        <WhatsAppFloat />
        <footer className="footer">
          <a className="brand-logo footer-logo" href="/" aria-label="Light Creative Hub home"><LiquidLogo /></a>
          <p>Creative ideas. Professional execution.</p>
          <div className="footer-contacts"><a href={"tel:"+contact.primaryPhone.replaceAll(" ","").replaceAll("-","")}>{contact.primaryPhone}</a><a href={"tel:"+contact.secondaryPhone.replaceAll(" ","").replaceAll("-","")}>{contact.secondaryPhone}</a><a href={"mailto:"+contact.email}>{contact.email}</a></div>
          <div className="footer-nav"><a href="/privacy">Privacy</a><a href="/services">Services</a><a href="/portfolio">Portfolio</a></div>
          <small>© {new Date().getFullYear()} Light Creative Hub. All rights reserved.</small>
        </footer>
      </body>
    </html>
  );
}
