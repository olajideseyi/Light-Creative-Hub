"use client";

import { useState } from "react";
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
      <nav id="primary-navigation" className={open ? "primary-navigation is-open" : "primary-navigation"} aria-label="Main navigation">
        {links.map((link) => (
          <a key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setOpen(false)}>
            {link.label}<span aria-hidden="true">↗</span>
          </a>
        ))}
        <a className="mobile-nav-cta" href="/request-a-quote" onClick={() => setOpen(false)}>Start a project <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
  );
}
