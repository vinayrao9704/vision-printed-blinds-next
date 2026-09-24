import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import ShopCatalog from '@/components/ShopCatalog';
import { products } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Shop All Custom Blinds & Shades',
  description: 'Browse all custom blinds and shades. Roller blinds, blackout, solar shades, zebra, motorized, specialty and commercial options — all with custom printing available.',
};

export default function ShopPage() {
  return (
    <>
      <section className="page-hero page-hero--shop">
        <div className="page-hero__bg"></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link> &rsaquo; Shop All Blinds</div>
          <span className="section-tag section-tag--light">{products.length} PRODUCTS</span>
          <h1 className="page-hero__title">SHOP ALL<br/><span className="text-gold">BLINDS &amp; SHADES</span></h1>
          <p className="page-hero__desc">Every blind type we offer — many available with custom printing. Filter by type, function, or feature to find your perfect window covering.</p>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <Link href="/custom" className="btn btn--gold btn--lg">★ Custom Printed Blinds</Link>
            <Link href="/quote" className="btn btn--outline-white btn--lg">Get a Free Quote</Link>
          </div>
        </div>
      </section>

      <section id="shop" className="section shop">
        <div className="container">
          <Suspense fallback={null}>
            <ShopCatalog />
          </Suspense>
        </div>
      </section>

      <section className="section business">
        <div className="container">
          <div className="business__inner">
            <div className="business__text animate-in">
              <span className="section-tag section-tag--light">FOR BUSINESSES</span>
              <h2 className="section-title section-title--white">NEED COMMERCIAL<br/>OR BRANDED BLINDS?</h2>
              <p className="business__desc">We work with offices, restaurants, retailers, hotels, and commercial spaces of any size. Custom branding, large quantities, professional installation support.</p>
              <div className="business__features">
                <div className="business__feat"><span>✓</span> Logo &amp; brand printing</div>
                <div className="business__feat"><span>✓</span> Large quantities</div>
                <div className="business__feat"><span>✓</span> Commercial-grade products</div>
                <div className="business__feat"><span>✓</span> Installation support</div>
              </div>
              <Link href="/quote" className="btn btn--gold btn--lg btn--animated">Request a Business Quote</Link>
            </div>
            <div className="business__visual animate-in">
              <div className="business__mockup"><div className="scene--cp-business" style={{width:'100%',height:'100%',position:'relative'}}><div className="blind-slats"></div></div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
