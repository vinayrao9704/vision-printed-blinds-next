import type { Metadata } from 'next';
import Link from 'next/link';
import FaqAccordion from '@/components/FaqAccordion';
import { products } from '@/lib/products';

export const metadata: Metadata = {
  title: 'About Us & FAQ',
  description: "Learn about Vision Printed Blinds — Edmonton's custom blind specialists. Our story, why customers choose us, and answers to frequently asked questions.",
};

const whyCards = [
  { icon:'🎨', title:'TRUE CUSTOM PRINTING', text:'Full-resolution UV printing on every blind. Your image — a photo, logo, artwork, or pattern — reproduced at commercial quality that lasts for years.' },
  { icon:'📐', title:'MADE TO MEASURE', text:'Every blind is cut to your exact window dimensions. No gaps, no overlaps, no awkward sizing. Just a perfect fit, every time.' },
  { icon:'🇨🇦', title:'EDMONTON LOCAL', text:"We're based in Edmonton, Alberta. Local consultations, local expertise, and direct communication — no middlemen, no overseas call centres." },
  { icon:'🏅', title:'PREMIUM FABRICS', text:"Commercial-grade roller, blackout, and solar fabrics from trusted suppliers. Durable, UV-resistant, and built for Alberta's climate." },
  { icon:'⚡', title:'FAST TURNAROUND', text:"Custom orders typically completed within 7–14 business days. We know your windows can't wait — neither do we." },
  { icon:'🏢', title:'RESIDENTIAL & COMMERCIAL', text:'From a single bedroom blind to outfitting an entire commercial space with branded window treatments — we scale to every project size.' },
  { icon:'🔒', title:'FREE CONSULTATION', text:"Not sure what you need? Call or email us. We'll walk you through fabric choice, blackout ratings, motorization, and custom printing — at no cost." },
  { icon:'✅', title:'SATISFACTION GUARANTEE', text:"We stand behind every blind we make. If something isn't right, we make it right — no arguments, no runaround." },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-hero page-hero--about">
        <div className="page-hero__bg"></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link> &rsaquo; About</div>
          <span className="section-tag section-tag--light">OUR STORY</span>
          <h1 className="page-hero__title">EDMONTON&apos;S CUSTOM<br/><span className="text-gold">BLIND SPECIALISTS</span></h1>
          <p className="page-hero__desc">We&apos;re passionate about transforming windows into visual statements — combining premium blind craftsmanship with high-resolution custom printing so your windows tell your story.</p>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <Link href="/quote" className="btn btn--gold btn--lg btn--animated">Get a Free Quote</Link>
            <Link href="/shop?tab=custom" className="btn btn--outline-white btn--lg">Shop Custom Printed</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{background:'var(--white)'}}>
        <div className="container">
          <div className="about-split animate-in">
            <div className="about-split__text">
              <span className="section-tag">WHO WE ARE</span>
              <h2 className="section-title" style={{textAlign:'left',marginLeft:0}}>WE MAKE YOUR<br/><span style={{color:'var(--gold)'}}>WINDOWS COME ALIVE</span></h2>
              <p style={{color:'var(--text-mid)',lineHeight:1.75,marginBottom:'18px'}}>Vision Printed Blinds is an Edmonton-based window covering company with a singular focus: giving homeowners and businesses a window covering that&apos;s entirely their own. We combine commercial-grade blind fabrics with state-of-the-art UV printing to produce blinds you won&apos;t find anywhere else.</p>
              <p style={{color:'var(--text-mid)',lineHeight:1.75,marginBottom:'18px'}}>From a Rocky Mountain sunrise above your living room window, to your business logo on your office blinds, to a family photo in the nursery — we print it all at full resolution, with vibrant colour that doesn&apos;t fade.</p>
              <p style={{color:'var(--text-mid)',lineHeight:1.75,marginBottom:'30px'}}>Every order is custom-measured, custom-printed, and custom-made. There is no &ldquo;off-the-shelf&rdquo; — we don&apos;t believe in it.</p>
              <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                <Link href="/quote" className="btn btn--navy btn--lg">Request a Quote</Link>
                <Link href="/gallery" className="btn btn--outline-navy btn--lg">View Gallery</Link>
              </div>
            </div>
            <div className="about-split__visual animate-in">
              <div className="about-visual-stack">
                <div className="about-visual-card about-visual-card--1">
                  <div className="scene--cp-landscape" style={{width:'100%',height:'100%',position:'relative',borderRadius:'inherit'}}><div className="blind-slats"></div></div>
                </div>
                <div className="about-visual-card about-visual-card--2">
                  <div className="scene--cp-photo" style={{width:'100%',height:'100%',position:'relative',borderRadius:'inherit'}}><div className="blind-slats"></div></div>
                </div>
                <div className="about-stat-badge">
                  <span className="about-stat-badge__num">500<span style={{color:'var(--gold)'}}>+</span></span>
                  <span className="about-stat-badge__label">Custom Blinds<br/>Installed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="container">
          <div className="stats-bar__grid">
            <div className="stats-bar__item"><span className="stats-bar__num">500<span className="stats-bar__plus">+</span></span><span className="stats-bar__label">Custom Blinds Installed</span></div>
            <div className="stats-bar__item"><span className="stats-bar__num">100<span className="stats-bar__plus">%</span></span><span className="stats-bar__label">Custom Made to Order</span></div>
            <div className="stats-bar__item"><span className="stats-bar__num">{products.length}</span><span className="stats-bar__label">Blind &amp; Shade Types</span></div>
            <div className="stats-bar__item"><span className="stats-bar__num">4.9<span className="stats-bar__plus">★</span></span><span className="stats-bar__label">Average Customer Rating</span></div>
          </div>
        </div>
      </div>

      <section className="section" style={{background:'var(--off-white)'}}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">WHY CHOOSE US</span>
            <h2 className="section-title">8 REASONS CUSTOMERS<br/><span style={{color:'var(--gold)'}}>CHOOSE VISION</span></h2>
          </div>
          <div className="why-grid">
            {whyCards.map(w => (
              <div className="why-card animate-in" key={w.title}>
                <div className="why-card__icon">{w.icon}</div>
                <h3 className="why-card__title">{w.title}</h3>
                <p className="why-card__text">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section hiw">
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag section-tag--light">OUR PROCESS</span>
            <h2 className="section-title section-title--white">HOW IT <span style={{color:'var(--gold)'}}>WORKS</span></h2>
            <p className="section-desc section-desc--light">From your idea to your window — four simple steps.</p>
          </div>
          <div className="hiw-steps">
            <div className="hiw-step animate-in"><div className="hiw-step__num">01</div><div className="hiw-step__body"><h3>MEASURE YOUR WINDOWS</h3><p>Use our <Link href="/measure-guide" style={{color:'var(--gold)'}}>measurement guide</Link> or request an in-person consultation. Precise measurements ensure a perfect fit — we walk you through it step by step.</p></div></div>
            <div className="hiw-step animate-in"><div className="hiw-step__num">02</div><div className="hiw-step__body"><h3>CHOOSE YOUR DESIGN</h3><p>Browse our gallery for inspiration or upload your own image. Use our preview tool to see your design composited on your window before ordering.</p></div></div>
            <div className="hiw-step animate-in"><div className="hiw-step__num">03</div><div className="hiw-step__body"><h3>WE PRINT &amp; CRAFT</h3><p>Your custom blind is printed at full UV-quality resolution, precision-cut to your measurements, and assembled with commercial-grade hardware.</p></div></div>
            <div className="hiw-step animate-in"><div className="hiw-step__num">04</div><div className="hiw-step__body"><h3>DELIVERED TO YOUR DOOR</h3><p>Your finished blind ships directly to you with installation hardware and instructions. Installation support is available on request.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section faq" id="faq">
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">FAQ</span>
            <h2 className="section-title">FREQUENTLY ASKED<br/><span style={{color:'var(--gold)'}}>QUESTIONS</span></h2>
          </div>
          <FaqAccordion />
          <div className="faq-still" style={{textAlign:'center',marginTop:'48px'}}>
            <p style={{color:'var(--text-mid)',marginBottom:'20px',fontSize:'1.05rem'}}>Still have questions? We&apos;re happy to help.</p>
            <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
              <Link href="/quote" className="btn btn--gold btn--lg btn--animated">Get a Free Quote</Link>
              <a href="mailto:info@visionprintedblinds.ca" className="btn btn--outline-navy btn--lg">Email Us</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section testimonials" style={{background:'var(--off-white)'}}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">REVIEWS</span>
            <h2 className="section-title">WHAT OUR CUSTOMERS<br/><span style={{color:'var(--gold)'}}>ARE SAYING</span></h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card animate-in">
              <div className="testimonial-card__stars">★★★★★</div>
              <blockquote className="testimonial-card__quote">&ldquo;We had our wedding photo printed on the bedroom blind. The quality blew us away — colours look exactly like the original photo. Totally worth every penny.&rdquo;</blockquote>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{background:'linear-gradient(135deg,#1341A0,#F5A523)'}}>SL</div>
                <div><strong>Sarah &amp; Luke T.</strong><span>Edmonton Homeowners</span></div>
              </div>
            </div>
            <div className="testimonial-card animate-in">
              <div className="testimonial-card__stars">★★★★★</div>
              <blockquote className="testimonial-card__quote">&ldquo;Our restaurant has 12 windows with custom branded blinds. Every customer comments on them. The whole process was smooth and the team was incredibly responsive.&rdquo;</blockquote>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{background:'linear-gradient(135deg,#0B3A8A,#F5A523)'}}>MK</div>
                <div><strong>Marcus K.</strong><span>Restaurant Owner, Edmonton</span></div>
              </div>
            </div>
            <div className="testimonial-card animate-in">
              <div className="testimonial-card__stars">★★★★★</div>
              <blockquote className="testimonial-card__quote">&ldquo;Ordered blackout blinds for all 4 bedrooms. Measured them myself using the guide they sent and everything fit perfectly. Super impressed with the quality.&rdquo;</blockquote>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{background:'linear-gradient(135deg,#1A0050,#1341A0)'}}>JM</div>
                <div><strong>Jennifer M.</strong><span>Sherwood Park, AB</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="final-cta__bg"></div>
        <div className="container cta-final__inner">
          <span className="section-tag section-tag--light">GET STARTED</span>
          <h2 className="section-title section-title--white">READY TO TRANSFORM<br/><span style={{color:'var(--gold)'}}>YOUR WINDOWS?</span></h2>
          <p className="section-desc section-desc--light">Request a free quote and one of our team members will be in touch within one business day.</p>
          <div className="cta-final__btns">
            <Link href="/quote" className="btn btn--gold btn--xl btn--animated">Get a Free Quote</Link>
            <Link href="/shop?tab=custom" className="btn btn--outline-white btn--xl">★ Shop Custom Printed</Link>
          </div>
        </div>
      </section>
    </>
  );
}
