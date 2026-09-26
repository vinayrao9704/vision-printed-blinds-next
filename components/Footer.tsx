import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">

          <div className="footer__brand">
            <div className="footer__logo">
              <Image src="/logo.png" alt="Vision Printed Blinds" width={190} height={60} className="footer__logo-img" />
            </div>
            <p className="footer__tagline">PRINT. COVER. TRANSFORM.</p>
            <p className="footer__location"><span className="maple">🍁</span> Edmonton, Alberta, Canada</p>
            <div className="footer__contact">
              <a href="tel:+16479495489" className="footer__contact-item">
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                647-949-5489
              </a>
              <a href="mailto:info@visionprintedblinds.ca">info@visionprintedblinds.ca</a>
            </div>
          </div>

          <div className="footer__nav">
            <h4>Pages</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products/roller-blinds">Blinds &amp; Shades</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/measure-guide">Measuring Guide</Link></li>
              <li><Link href="/about">About &amp; FAQ</Link></li>
              <li><Link href="/quote">Get a Quote</Link></li>
            </ul>
          </div>

          <div className="footer__services">
            <h4>Products</h4>
            <ul>
              <li>Custom Printed Roller Blinds</li>
              <li>Blackout Blinds</li>
              <li>Solar Shades</li>
              <li>Zebra Blinds</li>
              <li>Curtains &amp; Drapes</li>
              <li>Motorized Blinds</li>
              <li>Vertical Blinds</li>
              <li>Natural Shades</li>
            </ul>
          </div>

          <div className="footer__cta-col">
            <h4>Get Started</h4>
            <p>No prices listed — every blind is custom made to order.</p>
            <Link href="/quote" className="btn btn--gold" style={{width:'100%',justifyContent:'center',marginBottom:'10px'}}>
              Get Your Free Estimate
            </Link>
            <Link href="/custom-printed" className="btn btn--outline-white" style={{width:'100%',justifyContent:'center'}}>
              Shop Custom Printed
            </Link>
          </div>

        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Vision Printed Blinds. All Rights Reserved. | Edmonton, Alberta, Canada</p>
        </div>
      </div>
    </footer>
  );
}
