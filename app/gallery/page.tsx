import type { Metadata } from 'next';
import Link from 'next/link';
import GalleryGrid from '@/components/GalleryGrid';

export const metadata: Metadata = {
  title: 'Custom Blinds Gallery',
  description: "Gallery of custom printed blinds — mountain landscapes, family photos, business branding, children's designs, solar shades, and motorized blinds.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="page-hero page-hero--gallery">
        <div className="page-hero__bg"></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link> &rsaquo; Gallery</div>
          <span className="section-tag section-tag--light">INSPIRATION</span>
          <h1 className="page-hero__title">CUSTOM BLIND<br/><span className="text-gold">GALLERY</span></h1>
          <p className="page-hero__desc">Browse real custom printed blind designs — from mountain landscapes to family photos, business branding, kids rooms, and more. Filter by category to find your inspiration.</p>
          <Link href="/custom" className="btn btn--gold btn--lg btn--animated">★ Try the Preview Tool</Link>
        </div>
      </section>

      <section className="section gallery">
        <div className="container">
          <GalleryGrid />
          <div className="gallery-cta">
            <h3>WHAT WILL YOU PRINT?</h3>
            <p>Upload your image and see it on your window instantly with our preview tool.</p>
            <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap',marginTop:'8px'}}>
              <Link href="/custom" className="btn btn--gold btn--lg btn--animated">Try the Preview Tool</Link>
              <Link href="/quote" className="btn btn--outline-white btn--lg">Get a Free Quote</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
