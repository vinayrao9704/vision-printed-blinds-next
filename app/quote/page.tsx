import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import QuoteForm from '@/components/QuoteForm';

export const metadata: Metadata = {
  title: 'Get a Free Quote',
  description: 'Request a free custom blind quote from Vision Printed Blinds in Edmonton. Tell us your window dimensions, fabric preferences, and custom printing needs.',
};

export default function QuotePage() {
  return (
    <>
      <section className="page-hero page-hero--quote">
        <div className="page-hero__bg"></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link> &rsaquo; Get a Quote</div>
          <span className="section-tag section-tag--light">FREE &amp; NO OBLIGATION</span>
          <h1 className="page-hero__title">GET YOUR<br/><span className="text-gold">FREE QUOTE</span></h1>
          <p className="page-hero__desc">Tell us about your windows and what you&apos;re looking for. We&apos;ll respond within one business day with a tailored quote — no pressure, no commitment.</p>
        </div>
      </section>

      <section className="section quote-section" style={{background:'var(--off-white)'}}>
        <div className="container">
          <div className="quote-layout">

            <div className="quote-form-col">
              <Suspense fallback={<div className="quote-form-card" style={{ minHeight: '600px' }} />}>
                <QuoteForm />
              </Suspense>
            </div>

            <div className="quote-sidebar-col">

              <div className="qsb-card">
                <h3 className="qsb-card__title">PREFER TO TALK?</h3>
                <p className="qsb-card__desc">Email us directly. We&apos;re happy to discuss your project.</p>
                <a href="mailto:info@visionprintedblinds.ca" className="qsb-contact">
                  <div className="qsb-contact__icon">
                    <svg viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2"/></svg>
                  </div>
                  <div><strong>info@visionprintedblinds.ca</strong><span>Response within 1 business day</span></div>
                </a>
                <div className="qsb-location"><span className="maple">🍁</span> Edmonton, Alberta, Canada</div>
              </div>

              <div className="qsb-card qsb-card--navy">
                <div className="qsb-card__visual scene--cp-roller" style={{height:'130px',borderRadius:'var(--radius-md)',marginBottom:'18px',position:'relative'}}><div className="blind-slats"></div></div>
                <h3 className="qsb-card__title" style={{color:'var(--white)'}}>TRY BEFORE YOU ORDER</h3>
                <p className="qsb-card__desc" style={{color:'rgba(255,255,255,0.7)'}}>Upload your design and see it rendered on your window with our free preview tool.</p>
                <Link href="/custom" className="btn btn--gold" style={{width:'100%',justifyContent:'center'}}>★ Open Preview Tool</Link>
              </div>

              <div className="qsb-card">
                <h3 className="qsb-card__title">WHAT HAPPENS NEXT?</h3>
                <ol className="qsb-steps">
                  <li><span className="qsb-step-num">1</span><div><strong>We review your request</strong><p>Our team reviews your details and prepares a custom quote.</p></div></li>
                  <li><span className="qsb-step-num">2</span><div><strong>We reach out</strong><p>You&apos;ll hear from us within 1 business day via email or phone.</p></div></li>
                  <li><span className="qsb-step-num">3</span><div><strong>We finalize the details</strong><p>We confirm measurements, fabric choice, and any custom printing.</p></div></li>
                  <li><span className="qsb-step-num">4</span><div><strong>We get to work</strong><p>Once approved, your blinds go into production and ship to you.</p></div></li>
                </ol>
              </div>

              <div className="qsb-card qsb-card--light">
                <div className="qsb-trust-grid">
                  <div className="qsb-trust-item"><span className="qsb-trust-icon">🇨🇦</span><span>Edmonton Based</span></div>
                  <div className="qsb-trust-item"><span className="qsb-trust-icon">✅</span><span>No Obligation</span></div>
                  <div className="qsb-trust-item"><span className="qsb-trust-icon">⚡</span><span>Fast Response</span></div>
                  <div className="qsb-trust-item"><span className="qsb-trust-icon">🔒</span><span>Privacy Protected</span></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
