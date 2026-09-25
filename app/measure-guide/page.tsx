import type { Metadata } from 'next';
import Link from 'next/link';
import MeasureGuideInteractive from '@/components/MeasureGuideInteractive';

export const metadata: Metadata = {
  title: 'How to Measure Your Windows',
  description: 'An interactive guide to measuring your windows for custom blinds — inside mount vs outside mount, tools you need, and common mistakes to avoid.',
};

const tools = [
  { icon: '📏', title: 'STEEL TAPE MEASURE', text: 'Use a retractable steel tape, not a fabric or sewing tape — fabric stretches and throws off your numbers.' },
  { icon: '✏️', title: 'PENCIL & PAPER', text: "Sketch a quick outline of the window and jot down every measurement as you take it. Don't rely on memory." },
  { icon: '🪜', title: 'STEP STOOL', text: 'For taller windows, a stable step stool keeps you from stretching or eyeballing the top measurement.' },
  { icon: '🙋', title: 'A SECOND PAIR OF HANDS', text: 'Optional, but helpful on wide windows — one person holds the tape at both ends for a straighter reading.' },
];

const mistakes = [
  'Measuring only once — always double-check every number before ordering.',
  'Using a cloth or fabric tape measure instead of a rigid steel one.',
  'Averaging the three width or height readings instead of taking the narrowest (inside mount) or widest coverage (outside mount).',
  'Forgetting to check mounting depth for an inside-mount blind, then finding it doesn\'t clear a handle or sill.',
  'Rounding measurements to the nearest inch — order to the nearest 1/8".',
  'Writing down height x width instead of the standard width x height — always list width first to avoid mix-ups.',
  'Not confirming your exact minimum mounting depth with us before ordering — it varies by blind type.',
];

export default function MeasureGuidePage() {
  return (
    <>
      <section className="page-hero page-hero--about">
        <div className="page-hero__bg"></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link> &rsaquo; Measuring Guide</div>
          <span className="section-tag section-tag--light">STEP BY STEP</span>
          <h1 className="page-hero__title">HOW TO MEASURE<br/><span className="text-gold">YOUR WINDOWS</span></h1>
          <p className="page-hero__desc">A few careful measurements are all it takes for a perfect-fit blind. Follow this guide, or skip straight to a free in-person measurement with our team.</p>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <Link href="/quote" className="btn btn--gold btn--lg btn--animated">Get a Free Quote</Link>
            <Link href="/shop" className="btn btn--outline-white btn--lg">Shop All Blinds</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--white)'}}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">BEFORE YOU START</span>
            <h2 className="section-title">WHAT YOU&apos;LL <span style={{color:'var(--gold)'}}>NEED</span></h2>
          </div>
          <div className="why-grid">
            {tools.map(t => (
              <div className="why-card animate-in" key={t.title}>
                <div className="why-card__icon" style={{background:'none',fontSize:'26px'}}>{t.icon}</div>
                <h3 className="why-card__title" style={{fontFamily:'var(--font-display)',fontSize:'12px',fontWeight:800,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--navy)',marginBottom:'8px'}}>{t.title}</h3>
                <p className="why-card__text">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--off-white)'}}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">INTERACTIVE GUIDE</span>
            <h2 className="section-title">MEASURE ONCE,<br/><span style={{color:'var(--gold)'}}>FIT PERFECTLY</span></h2>
            <p className="section-desc">Toggle your mounting style below to see exactly where and how to measure your windows.</p>
          </div>
          <MeasureGuideInteractive />
        </div>
      </section>

      <section className="section" style={{background:'var(--white)'}}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">AVOID THESE</span>
            <h2 className="section-title">COMMON MEASURING <span style={{color:'var(--gold)'}}>MISTAKES</span></h2>
          </div>
          <div className="quote-sidebar-col" style={{maxWidth:'720px',margin:'0 auto'}}>
            <div className="qsb-card">
              <ul style={{margin:0,paddingLeft:'20px',display:'flex',flexDirection:'column',gap:'12px'}}>
                {mistakes.map(m => (
                  <li key={m} style={{color:'var(--text-mid)',lineHeight:1.6,fontSize:'14px'}}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="final-cta__bg"></div>
        <div className="container cta-final__inner">
          <span className="section-tag section-tag--light">NOT SURE?</span>
          <h2 className="section-title section-title--white">WE&apos;LL MEASURE<br/><span style={{color:'var(--gold)'}}>IT FOR YOU</span></h2>
          <p className="section-desc section-desc--light">Request a free consultation and one of our team members will measure your windows in person — no charge, no obligation.</p>
          <div className="cta-final__btns">
            <Link href="/quote" className="btn btn--gold btn--xl btn--animated">Get a Free Quote</Link>
            <Link href="/shop?tab=custom" className="btn btn--outline-white btn--xl">★ Shop Custom Printed</Link>
          </div>
        </div>
      </section>
    </>
  );
}
