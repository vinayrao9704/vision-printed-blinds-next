'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const [megaForceClosed, setMegaForceClosed] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobile(false); }, [pathname]);

  // Standard a11y expectation: Escape closes an open overlay/menu.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobile(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

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

  // Clicking a mega-menu link navigates, but the cursor hasn't moved and the
  // clicked link keeps focus — so both :hover and :focus-within stay true and
  // the dropdown just sits open over the new page. CSS alone can't detect a
  // click, so force it shut here and let it reopen naturally on next hover.
  function closeMegaOnClick() {
    setMegaForceClosed(true);
    (document.activeElement as HTMLElement | null)?.blur();
  }

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

          {/* Shop mega menu — shown via CSS :hover/:focus-within on .nav__item--mega */}
          <li
            className={`nav__item nav__item--mega${megaForceClosed ? ' force-closed' : ''}`}
            id="megaItem"
            onClick={closeMegaOnClick}
            onMouseLeave={() => setMegaForceClosed(false)}
          >
            <Link href="/shop" className="nav__link nav__link--has-mega">
              Shop Blinds
              <svg className="nav__chevron" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
            <div className="mega-menu" id="megaMenu">
              <div className="mega-menu__body">
                <div className="mega-col">
                  <h4 className="mega-col__head">BLINDS</h4>
                  <ul>
                    <li><Link href="/shop?tab=roller&highlight=roller-light">Roller Blinds</Link></li>
                    <li><Link href="/shop?tab=zebra&highlight=zebra-plain">Zebra Blinds</Link></li>
                    <li><Link href="/shop?tab=specialty&highlight=vertical">Vertical Blinds</Link></li>
                    <li><Link href="/shop?tab=specialty&highlight=panel-track">Panel Track</Link></li>
                  </ul>
                </div>
                <div className="mega-col">
                  <h4 className="mega-col__head">SHADES</h4>
                  <ul>
                    <li><Link href="/shop?tab=blackout&highlight=blkout-bdrm">Blackout Shades</Link></li>
                    <li><Link href="/shop?tab=solar&highlight=solar-res">Solar Shades</Link></li>
                    <li><Link href="/shop?tab=specialty&highlight=cellular">Cellular Shades</Link></li>
                    <li><Link href="/shop?tab=specialty&highlight=roman">Roman Shades</Link></li>
                    <li><Link href="/shop?tab=specialty&highlight=natural">Natural Shades</Link></li>
                  </ul>
                </div>
                <div className="mega-col">
                  <h4 className="mega-col__head">SMART &amp; SPECIALTY</h4>
                  <ul>
                    <li><Link href="/shop?tab=motorized&highlight=motor-roller">Motorized Blinds</Link></li>
                    <li><Link href="/shop?filter=smart-home">Smart Home</Link></li>
                    <li><Link href="/shop?filter=large-window">Large Windows</Link></li>
                    <li><Link href="/shop?tab=specialty&highlight=vertical">Patio Doors</Link></li>
                  </ul>
                </div>
                <div className="mega-col">
                  <h4 className="mega-col__head">CURTAINS &amp; DRAPES</h4>
                  <ul>
                    <li><Link href="/shop?tab=curtains&highlight=curtain-sheer">Sheer Curtains</Link></li>
                    <li><Link href="/shop?tab=curtains&highlight=curtain-blackout">Blackout Curtains</Link></li>
                    <li><Link href="/shop?tab=curtains&highlight=curtain-pleat">Pinch Pleat Drapes</Link></li>
                    <li><Link href="/shop?tab=curtains&highlight=curtain-custom">Custom Printed Curtains</Link></li>
                  </ul>
                </div>
                <div className="mega-col mega-col--featured">
                  <h4 className="mega-col__head mega-col__head--gold">★ CUSTOM PRINTED</h4>
                  <ul>
                    <li><Link href="/custom" className="mega-link--gold">Design Preview Tool</Link></li>
                    <li><Link href="/custom" className="mega-link--gold">Photo Blinds</Link></li>
                    <li><Link href="/custom" className="mega-link--gold">Landscape Prints</Link></li>
                    <li><Link href="/custom" className="mega-link--gold">Artwork &amp; Patterns</Link></li>
                    <li><Link href="/custom" className="mega-link--gold">Kids Designs</Link></li>
                    <li><Link href="/custom" className="mega-link--gold">Business Branding</Link></li>
                  </ul>
                </div>
              </div>
              <div className="mega-menu__cta">
                <div className="mega-feature-card">
                  <div className="mega-feature-card__img scene--cp-roller"><div className="blind-slats"></div></div>
                  <div className="mega-feature-card__body">
                    <span className="section-tag" style={{margin:'0 0 6px'}}>OUR SPECIALTY</span>
                    <h3>Custom Printed Blinds</h3>
                    <p>Print any photo or artwork on your blind.</p>
                    <Link href="/custom" className="btn btn--gold btn--sm">Try Preview Tool →</Link>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li><Link href="/custom" className={`nav__link nav__link--custom${isActive('/custom') ? ' active' : ''}`}>★ Custom Printing</Link></li>
          <li><Link href="/gallery"className={`nav__link${isActive('/gallery') ? ' active' : ''}`}>Gallery</Link></li>
          <li><Link href="/measure-guide" className={`nav__link${isActive('/measure-guide') ? ' active' : ''}`}>Measuring Guide</Link></li>
          <li><Link href="/about"  className={`nav__link${isActive('/about')   ? ' active' : ''}`}>About</Link></li>
          <li><Link href="/quote"  className={`nav__link${isActive('/quote')   ? ' active' : ''}`}>Contact</Link></li>
        </ul>

        {/* Desktop actions */}
        <div className="nav__actions">
          <Link href="/quote" className="btn btn--gold">Get a Free Quote</Link>
        </div>

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
      <div ref={mobileMenuRef} className={`nav__mobile${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <ul className="nav__mobile-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/shop">Shop All Blinds</Link></li>
          <li><Link href="/custom">★ Custom Printing</Link></li>
          <li><Link href="/gallery">Gallery</Link></li>
          <li><Link href="/measure-guide">Measuring Guide</Link></li>
          <li><Link href="/about">About &amp; FAQ</Link></li>
        </ul>
        <div className="nav__mobile-ctas">
          <Link href="/quote" className="btn btn--gold btn--full">Get a Free Quote</Link>
        </div>
      </div>
    </nav>
  );
}
