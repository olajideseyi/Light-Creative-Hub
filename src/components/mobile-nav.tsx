"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Our work" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" }
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="mobile-nav">
      <button
        type="button"
        className="mobile-menu-toggle"
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" className={open ? "menu-icon menu-icon-open" : "menu-icon"}><i /><i /></span>
        <span>{open ? "Close" : "Menu"}</span>
      </button>

      {open && <button className="mobile-nav-backdrop" type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)} />}

      <nav id="primary-navigation" className={open ? "primary-navigation is-open" : "primary-navigation"} aria-label="Main navigation" aria-hidden={!open && typeof window !== "undefined" && window.innerWidth <= 760}>
        <div className="mobile-nav-heading">
          <span>LIGHT CREATIVE HUB</span>
          <span>MENU / 0{links.length}</span>
        </div>
        {links.map((link, index) => (
          <a key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setOpen(false)}>
            <small>0{index + 1}</small>{link.label}<span aria-hidden="true">↗</span>
          </a>
        ))}
        <a className="mobile-nav-cta" href="/request-a-quote" onClick={() => setOpen(false)}>Start a project <span aria-hidden="true">↗</span></a>
        <div className="mobile-nav-foot">BRAND · DESIGN · PRINT · VISUAL CONTENT</div>
      </nav>
    </div>
  );
}
