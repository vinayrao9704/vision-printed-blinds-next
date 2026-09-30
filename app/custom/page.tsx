import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import BlindPreviewTool from '@/components/blind-designer/BlindPreviewTool';

export const metadata: Metadata = {
  title: 'Custom Printed Blinds Preview Tool',
  description: 'Upload a photo of your room and your design, and our tool automatically detects your window and fits your custom blind to it with realistic perspective and lighting.',
};

const designThemes = [
  { scene:'scene--des-mountain',  label:'Mountains & Landscapes' },
  { scene:'scene--des-beach',     label:'Beach & Tropical' },
  { scene:'scene--des-flower',    label:'Flowers & Nature' },
  { scene:'scene--des-city',      label:'City Skylines' },
  { scene:'scene--des-abstract',  label:'Abstract Art' },
  { scene:'scene--des-geometric', label:'Geometric Patterns' },
  { scene:'scene--des-kids',      label:'Kids & Nursery' },
  { scene:'scene--des-family',    label:'Family & Memories' },
  { scene:'scene--des-animals',   label:'Animals & Wildlife' },
  { scene:'scene--cp-business',   label:'Business & Branding' },
  { scene:'scene--des-photo',     label:'Custom Photography' },
  { scene:'scene--des-artwork',   label:'Custom Artwork' },
];

export default function CustomPage() {
  // Custom Printing / preview tool is disabled for now — planned to be
  // re-enabled later. Redirecting rather than deleting keeps the page below
  // intact so it can come back by simply removing this redirect.
  redirect('/');

  return (
    <>
      {/* PAGE HERO */}
      <section className="page-hero page-hero--custom">
        <div className="page-hero__bg"></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link> &rsaquo; Custom Printing</div>
          <span className="section-tag section-tag--light">OUR SIGNATURE PRODUCT</span>
          <h1 className="page-hero__title">CUSTOM PRINTED<br/><span className="text-gold">BLINDS</span></h1>
          <p className="page-hero__desc">Upload a photo of your room, and we&apos;ll automatically detect your window and fit your design to it with real perspective, lighting, and shadow. Upload your image below to see a live preview before you order.</p>
          <a href="#preview-tool" className="btn btn--gold btn--lg btn--animated">Try the Preview Tool ↓</a>
        </div>
      </section>

      {/* PREVIEW TOOL */}
      <section id="preview-tool" className="section preview-tool-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">SEE IT BEFORE YOU ORDER</span>
            <h2 className="section-title">DESIGN PREVIEW TOOL</h2>
            <p className="section-subtitle">Automatic window detection, perspective-accurate fitting, and a before/after comparison, live in your browser. No account needed.</p>
          </div>
          <BlindPreviewTool />
        </div>
      </section>

      {/* SHOP BY DESIGN */}
      <section id="shop-by-design" className="section shop-by-design">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">CHOOSE A DESIGN THEME</span>
            <h2 className="section-title">WHAT WILL YOU PRINT?</h2>
            <p className="section-subtitle">Browse popular design categories. Upload any of these ideas, or any image of your own, into the preview tool above.</p>
          </div>
          <div className="design-grid">
            {designThemes.map(d => (
              <div className="design-card animate-in" key={d.scene}>
                <div className={`design-card__img ${d.scene}`}>
                  <div className="blind-slats"></div>
                  <div className="design-card__label">{d.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="section-cta">
            <p style={{color:'var(--text-light)',marginBottom:'16px'}}>Have a different idea? We can print <strong>any image</strong>.</p>
            <Link href="/quote" className="btn btn--navy btn--lg">Upload Your Own Image →</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">THE PROCESS</span>
            <h2 className="section-title">HOW CUSTOM PRINTING WORKS</h2>
          </div>
          <div className="steps-grid">
            <div className="step animate-in">
              <div className="step__number">01</div>
              <div className="step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
              <h3>UPLOAD YOUR IMAGE</h3>
              <p>Use the preview tool above or our quote form. Send us your photo, artwork, logo, or any design file.</p>
            </div>
            <div className="step__connector" aria-hidden="true"><svg viewBox="0 0 40 24" fill="none"><path d="M0 12 H36 M28 4 L36 12 L28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div>
            <div className="step animate-in">
              <div className="step__number">02</div>
              <div className="step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg></div>
              <h3>WE SEND A PROOF</h3>
              <p>Our team prepares a digital proof showing exactly how your design will look on the blind. You approve it before we print.</p>
            </div>
            <div className="step__connector" aria-hidden="true"><svg viewBox="0 0 40 24" fill="none"><path d="M0 12 H36 M28 4 L36 12 L28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div>
            <div className="step animate-in">
              <div className="step__number">03</div>
              <div className="step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14"/></svg></div>
              <h3>HIGH-QUALITY PRINT</h3>
              <p>Once approved, we produce your custom blind with vibrant, durable printing on premium fabric.</p>
            </div>
            <div className="step__connector" aria-hidden="true"><svg viewBox="0 0 40 24" fill="none"><path d="M0 12 H36 M28 4 L36 12 L28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div>
            <div className="step animate-in">
              <div className="step__number">04</div>
              <div className="step__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
              <h3>YOUR SPACE, TRANSFORMED</h3>
              <p>Your custom blind is shipped to you. Install it and transform your window into something uniquely yours.</p>
            </div>
          </div>
          <div className="section-cta"><Link href="/quote" className="btn btn--gold btn--lg btn--animated">Start My Custom Order</Link></div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta">
        <div className="final-cta__bg"></div>
        <div className="final-cta__slats"></div>
        <div className="final-cta__overlay"></div>
        <div className="container final-cta__inner">
          <h2 className="final-cta__title">YOUR IMAGE.<br/>YOUR WINDOW.<br/><span className="final-cta__accent">OUR PRINT.</span></h2>
          <p className="final-cta__sub">Try the preview tool above, then request your free estimate.</p>
          <div className="final-cta__btns">
            <a href="#preview-tool" className="btn btn--gold btn--xl btn--animated">Try Preview Tool</a>
            <Link href="/quote" className="btn btn--outline-white btn--xl">Get Your Free Estimate</Link>
          </div>
        </div>
      </section>
    </>
  );
}
