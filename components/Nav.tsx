'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface DropdownItem { label: string; href: string; className?: string }
interface DropdownGroup { key: string; label: string; items: DropdownItem[] }

const DROPDOWNS: DropdownGroup[] = [
  {
    key: 'blinds',
    label: 'Blinds',
    items: [
      { label: 'Venetian Blinds', href: '/products/venetian-blinds' },
      { label: 'Vertical Blinds', href: '/products/vertical-blinds' },
      { label: 'Panel Track Blinds', href: '/products/panel-track-blinds' },
    ],
  },
  {
    key: 'shades',
    label: 'Shades',
    items: [
      { label: 'Roller Shades', href: '/products/roller-shades' },
      { label: 'Zebra Shades', href: '/products/zebra-shades' },
      { label: 'Sheer Shades', href: '/products/sheer-shades' },
      { label: 'Solar Shades', href: '/products/solar-shades' },
      { label: 'Cellular Shades', href: '/products/cellular-shades' },
      { label: 'Roman Shades', href: '/products/roman-shades' },
    ],
  },
  {
    key: 'curtains',
    label: 'Curtains & Drapes',
    items: [
      { label: 'Sheer Curtains', href: '/products/sheer-curtains' },
      { label: 'Blackout Curtains', href: '/products/blackout-curtains' },
      { label: 'Pinch Pleat Drapes', href: '/products/pinch-pleat-drapes' },
    ],
  },
];

function ChevronIcon() {
  return (
    <svg className="nav__chevron" viewBox="0 0 12 8" fill="none">
      <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const [openMenu, setOpenMenu]   = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu and any open dropdown on route change
  useEffect(() => { setMobile(false); setOpenMenu(null); }, [pathname]);

  // Standard a11y expectation: Escape closes an open overlay/menu.
  useEffect(() => {
    if (!mobileOpen && !openMenu) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMobile(false);
      setOpenMenu(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, openMenu]);

  // Tapping/clicking anywhere outside the open mobile menu (and outside the
  // hamburger itself, which already toggles it) should close it too.
  useEffect(() => {
    if (!mobileOpen) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (mobileMenuRef.current?.contains(target)) return;
      if (hamburgerRef.current?.contains(target)) return;
      setMobile(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [mobileOpen]);

  // Clicking anywhere outside an open desktop dropdown closes it. Only one
  // dropdown is ever open at once since openMenu holds a single key.
  useEffect(() => {
    if (!openMenu) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Element;
      if (target.closest?.('.nav__item--drop, .mobile-accordion')) return;
      setOpenMenu(null);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [openMenu]);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="nav__container">

        {/* Logo */}
        <Link href="/" className="nav__logo">
          <Image src="/logo-dark.png" alt="Vision Printed Blinds" width={140} height={44} priority className="nav__logo-img" />
        </Link>

        {/* Desktop links */}
        <ul className="nav__links" id="navLinks">
          {DROPDOWNS.map((group) => (
            <li
              key={group.key}
              className="nav__item nav__item--drop"
              onMouseLeave={() => setOpenMenu((m) => (m === group.key ? null : m))}
            >
              <button
                type="button"
                className={`nav__link nav__link--has-drop${openMenu === group.key ? ' nav__link--open' : ''}`}
                aria-haspopup="true"
                aria-expanded={openMenu === group.key}
                onClick={() => setOpenMenu((m) => (m === group.key ? null : group.key))}
              >
                {group.label}
                <ChevronIcon />
              </button>
              <div className={`nav__dropdown${openMenu === group.key ? ' open' : ''}`} id={`dropdown-${group.key}`}>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className={item.className} onClick={() => setOpenMenu(null)}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}

          <li><Link href="/custom-printed-blinds" className={`nav__link nav__link--custom${isActive('/custom-printed-blinds') ? ' active' : ''}`}><span className="nav__link-star" aria-hidden="true">★</span> Custom Printed Blinds</Link></li>
          <li><Link href="/gallery"className={`nav__link${isActive('/gallery') ? ' active' : ''}`}>Gallery</Link></li>
          <li><Link href="/measure-guide" className={`nav__link${isActive('/measure-guide') ? ' active' : ''}`}>Measuring Guide</Link></li>
          <li><Link href="/about"  className={`nav__link${isActive('/about')   ? ' active' : ''}`}>About</Link></li>
        </ul>

        {/* Desktop actions */}
        <div className="nav__actions">
          <Link href="/quote" className="btn btn--gold">Get Your Free Estimate</Link>
        </div>

        {/* Mobile call button */}
        <a href="tel:+16479495489" className="nav__mobile-call" aria-label="Call us at 647-949-5489">
          <span className="nav__mobile-call-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <span className="nav__mobile-call-number">647-949-5489</span>
        </a>

        {/* Hamburger */}
        <button
          ref={hamburgerRef}
          className={`nav__hamburger${mobileOpen ? ' open' : ''}`}
          id="hamburger"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobile(v => !v)}
        >
          <span/><span/><span/>
        </button>
      </div>

      {/* Mobile menu */}
      <div ref={mobileMenuRef} className={`nav__mobile${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen} inert={!mobileOpen}>
        <ul className="nav__mobile-links">
          <li><Link href="/">Home</Link></li>
        </ul>

        {DROPDOWNS.map((group) => (
          <div className="mobile-accordion" key={group.key}>
            <button
              type="button"
              className="mobile-acc-head"
              aria-expanded={openMenu === group.key}
              onClick={() => setOpenMenu((m) => (m === group.key ? null : group.key))}
            >
              {group.label}
              <ChevronIcon />
            </button>
            <div className={`mobile-acc-body${openMenu === group.key ? ' open' : ''}`}>
              <div className="mobile-acc-links">
                {group.items.map((item) => (
                  <Link key={item.label} href={item.href} className={item.className}>{item.label}</Link>
                ))}
              </div>
            </div>
          </div>
        ))}

        <ul className="nav__mobile-links">
          <li><Link href="/custom-printed-blinds" className="nav__link--custom"><span className="nav__link-star" aria-hidden="true">★</span> Custom Printed Blinds</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/measure-guide">Measuring Guide</Link></li>
          <li><Link href="/about">About &amp; FAQ</Link></li>
        </ul>
        <div className="nav__mobile-ctas">
          <Link href="/quote" className="btn btn--gold btn--full">Get Your Free Estimate</Link>
        </div>
      </div>
    </nav>
  );
}
