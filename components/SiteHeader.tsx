"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
];

const menuLinks = [
  { href: "/", label: "Home" },
  ...links,
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu on back/forward navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While the menu is open: lock page scroll, close on Escape, and close if
  // the window grows past the phone layout.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const wide = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (wide.matches) setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onResize);
    };
  }, [open]);

  const current = (href: string) => {
    const active =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);
    return active ? ("page" as const) : undefined;
  };

  return (
    // The fade lets text scrolling underneath disappear instead of running
    // into the nav.
    <header className="sticky top-0 z-40 flex h-[var(--header-h)] items-center bg-gradient-to-b from-paper from-50% to-paper/0 px-gutter print:hidden">
      <nav aria-label="Main" className="flex w-full items-center justify-between">
        <div data-reveal="mask">
          <Link href="/" aria-label={`${profile.name}, home`} className="block">
            <span
              aria-hidden="true"
              className="logo-mark h-[max(2.25rem,2.6vw)] w-[max(2.25rem,2.6vw)]"
            />
          </Link>
        </div>

        <div className="hidden items-center gap-[max(1.5rem,2.2vw)] font-medium md:flex">
          <ul className="flex items-center gap-[max(1.5rem,2.2vw)]">
            {links.map((l) => (
              <li key={l.href} data-reveal="mask">
                <Link href={l.href} aria-current={current(l.href)} className="link-draw">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div data-reveal="mask">
            <Link href="/contact" aria-current={current("/contact")} className="pill">
              Get in touch
            </Link>
          </div>
        </div>

        <div data-reveal="mask" className="md:hidden">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu"
            className="pill relative z-10"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="menu"
          className="menu-panel fixed inset-0 -z-10 flex flex-col justify-between overflow-y-auto bg-paper px-gutter pb-10 pt-[calc(var(--header-h)+2rem)] md:hidden"
        >
          <ul>
            {menuLinks.map((l) => (
              <li key={l.href} data-reveal="mask">
                <Link
                  href={l.href}
                  aria-current={current(l.href)}
                  onClick={() => setOpen(false)}
                  className="type-menu"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div data-reveal="fade">
            <p className="text-small text-muted">Email</p>
            <a href={`mailto:${profile.email}`} className="link-draw text-lead">
              {profile.email}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
