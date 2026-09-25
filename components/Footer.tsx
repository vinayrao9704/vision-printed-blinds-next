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
              <a href="mailto:info@visionprintedblinds.ca">info@visionprintedblinds.ca</a>
            </div>
          </div>

          <div className="footer__nav">
            <h4>Pages</h4>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Shop All Blinds</Link></li>
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
              Get a Free Quote
            </Link>
            <Link href="/shop?tab=custom" className="btn btn--outline-white" style={{width:'100%',justifyContent:'center'}}>
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
