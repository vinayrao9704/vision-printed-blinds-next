import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import GalleryGrid from '@/components/GalleryGrid';

export const metadata: Metadata = {
  title: 'Custom Blinds Gallery',
  description: "Gallery of custom printed blinds: mountain landscapes, family photos, business branding, children's designs, solar shades, and motorized blinds.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero page-hero--gallery">
        <div className="page-hero__bg">
          <Image src="/images/gallery-hero.png" alt="Collage of custom printed roller blinds: floral, mountain lake, and abstract designs in styled rooms" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
        </div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link> &rsaquo; Gallery</div>
          <span className="section-tag section-tag--light">INSPIRATION</span>
          <h1 className="page-hero__title">CUSTOM BLIND<br/><span className="text-gold">GALLERY</span></h1>
          <p className="page-hero__desc">Browse real custom printed blind designs, from mountain landscapes to family photos, business branding, kids rooms, and more. Filter by category to find your inspiration.</p>
          <Link href="/custom-printed-blinds" className="btn btn--gold btn--lg btn--animated">★ Shop Custom Printed</Link>
        </div>
      </section>

      <section className="section gallery">
        <div className="container">
          <GalleryGrid />
          <div className="gallery-cta">
            <h2>WHAT WILL YOU PRINT?</h2>
            <p>Any photo, design, logo, or artwork, printed at full UV quality on your blind.</p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',marginTop:'8px'}}>
              <Link href="/custom-printed-blinds" className="btn btn--gold btn--lg btn--animated">Shop Custom Printed</Link>
              <Link href="/quote" className="btn btn--outline-white btn--lg">Get Your Free Estimate</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
