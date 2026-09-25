import Link from 'next/link';
import { products } from '@/lib/products';

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero__bg"></div>
        <div className="hero__slats"></div>
        <div className="hero__overlay"></div>
        <div className="hero__container">
          <div className="hero__content">
            <div className="hero__badge">ANY IMAGE • ANY DESIGN • ANY SPACE</div>
            <h1 className="hero__title">TURN YOUR<br/>WINDOWS<br/><span className="hero__title-accent">INTO ART.</span></h1>
            <p className="hero__subtitle">Custom Printed Blinds Made From Your Image.</p>
            <p className="hero__desc">Transform ordinary windows into stunning focal points with custom-printed blinds featuring your photos, artwork, patterns, landscapes, logos, and designs.</p>
            <div className="hero__ctas">
              <Link href="/quote" className="btn btn--gold btn--lg btn--animated">Get a Free Quote</Link>
              <Link href="/shop" className="btn btn--outline-white btn--lg">Explore All Blinds</Link>
            </div>
            <p className="hero__trust"><span className="maple">🍁</span> Serving Edmonton, Alberta &amp; Canada</p>
          </div>
          <div className="hero__visual">
            <div className="hero__window-frame">
              <div className="hero__window-inner">
                <div className="hero__blind-preview"><div className="hero__blind-slats"></div></div>
              </div>
              <div className="hero__window-sill"></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-bar__grid">
            <div className="stats-bar__item"><span className="stats-bar__num">500<span className="stats-bar__plus">+</span></span><span className="stats-bar__label">Custom Blinds Installed</span></div>
            <div className="stats-bar__item"><span className="stats-bar__num">100<span className="stats-bar__plus">%</span></span><span className="stats-bar__label">Custom Made to Order</span></div>
            <div className="stats-bar__item"><span className="stats-bar__num">{products.length}</span><span className="stats-bar__label">Blind &amp; Shade Types</span></div>
            <div className="stats-bar__item"><span className="stats-bar__num">4.9<span className="stats-bar__plus">★</span></span><span className="stats-bar__label">Customer Rating</span></div>
          </div>
        </div>
      </div>

      {/* VALUE PROPOSITION */}
      <section className="section vp" style={{background:'var(--white)'}}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">WHY VISION PRINTED BLINDS</span>
            <h2 className="section-title">PREMIUM BLINDS. CUSTOM PRINTED.<br/><span style={{color:'var(--gold)'}}>MADE FOR YOU.</span></h2>
          </div>
          <div className="vp-grid">
            <div className="vp-card animate-in"><div className="vp-card__icon">🎨</div><h3>Custom Printing</h3><p>Any photo, design, logo, or artwork — printed at full UV quality on commercial-grade blind fabric. Your window, your image.</p></div>
            <div className="vp-card animate-in"><div className="vp-card__icon">📐</div><h3>Made to Measure</h3><p>Every blind is cut precisely to your window dimensions. Inside or outside mount — we make it fit perfectly.</p></div>
            <div className="vp-card animate-in"><div className="vp-card__icon">🇨🇦</div><h3>Edmonton Based</h3><p>Locally owned and operated in Edmonton, Alberta. We serve customers across Canada — residential and commercial.</p></div>
            <div className="vp-card animate-in"><div className="vp-card__icon">✅</div><h3>Free Quote, No Obligation</h3><p>No listed prices — every blind is custom. Get a tailored quote within one business day. No commitment required.</p></div>
          </div>
        </div>
      </section>

      {/* EXPLORE THE SITE */}
      <section className="section" style={{background:'var(--off-white)'}}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">EXPLORE</span>
            <h2 className="section-title">EVERYTHING YOU NEED<br/><span style={{color:'var(--gold)'}}>IN ONE PLACE</span></h2>
            <p className="section-desc">From choosing your blind style to uploading your design, every step is covered.</p>
          </div>
          <div className="home-nav-cards">
            <Link href="/shop?tab=custom" className="home-nav-card home-nav-card--gold animate-in">
              <div className="home-nav-card__img scene--cp-landscape" style={{position:'relative'}}><div className="blind-slats"></div></div>
              <div className="home-nav-card__body">
                <div className="home-nav-card__tag">★ Our Specialty</div>
                <div className="home-nav-card__title">Custom Printed Blinds</div>
                <p className="home-nav-card__desc">Any photo, design, logo, or artwork — printed at full UV quality on commercial-grade blind fabric.</p>
                <span className="home-nav-card__cta">Shop Custom Printed →</span>
              </div>
            </Link>
            <Link href="/shop" className="home-nav-card animate-in">
              <div className="home-nav-card__img scene--roller-light" style={{position:'relative'}}><div className="blind-slats"></div></div>
              <div className="home-nav-card__body">
                <div className="home-nav-card__tag">{products.length} Products</div>
                <div className="home-nav-card__title">Shop All Blinds &amp; Shades</div>
                <p className="home-nav-card__desc">Roller, zebra, blackout, solar, motorized, cellular, roman — browse and filter every style we offer.</p>
                <span className="home-nav-card__cta">Shop Now →</span>
              </div>
            </Link>
            <Link href="/gallery" className="home-nav-card animate-in">
              <div className="home-nav-card__img scene--des-mountain" style={{position:'relative'}}><div className="blind-slats"></div></div>
              <div className="home-nav-card__body">
                <div className="home-nav-card__tag">12 Gallery Items</div>
                <div className="home-nav-card__title">Custom Blind Gallery</div>
                <p className="home-nav-card__desc">Browse real printed blind designs — mountain scenes, family photos, business branding, solar shades, and more.</p>
                <span className="home-nav-card__cta">View Gallery →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CUSTOM PRINTING HERO SECTION */}
      <section className="section cp-hero">
        <div className="container">
          <div className="cp-hero__inner animate-in">
            <div className="cp-hero__text">
              <span className="section-tag section-tag--light">★ OUR SPECIALTY</span>
              <h2 className="section-title section-title--white">PRINT. COVER.<br/><span style={{color:'var(--gold)'}}>TRANSFORM.</span></h2>
              <p className="cp-hero__desc">We take any image you love — a family photo, a mountain landscape, a business logo, abstract art — and print it at full resolution on premium blind fabric. The result is a window covering that&apos;s entirely yours.</p>
              <ul className="cp-hero__list">
                <li>✓ Family portraits &amp; personal photos</li>
                <li>✓ Landscape &amp; nature photography</li>
                <li>✓ Business logos &amp; branding</li>
                <li>✓ Artwork, patterns &amp; abstract designs</li>
                <li>✓ Kids themes &amp; nursery scenes</li>
              </ul>
              <div style={{display:'flex',gap:'12px',flexWrap:'wrap',marginTop:'28px'}}>
                <Link href="/shop?tab=custom" className="btn btn--gold btn--lg btn--animated">★ Shop Custom Printed</Link>
                <Link href="/gallery" className="btn btn--outline-white btn--lg">View Gallery</Link>
              </div>
            </div>
            <div className="cp-hero__visual">
              <div className="cp-hero__grid">
                <div className="cp-card"><div className="scene--cp-landscape" style={{width:'100%',height:'100%',position:'relative'}}><div className="blind-slats"></div></div><span>Landscapes</span></div>
                <div className="cp-card"><div className="scene--cp-photo" style={{width:'100%',height:'100%',position:'relative'}}><div className="blind-slats"></div></div><span>Family Photos</span></div>
                <div className="cp-card"><div className="scene--cp-business" style={{width:'100%',height:'100%',position:'relative'}}><div className="blind-slats"></div></div><span>Branding</span></div>
                <div className="cp-card"><div className="scene--cp-kids" style={{width:'100%',height:'100%',position:'relative'}}><div className="blind-slats"></div></div><span>Kids &amp; Nursery</span></div>
                <div className="cp-card"><div className="scene--cp-art" style={{width:'100%',height:'100%',position:'relative'}}><div className="blind-slats"></div></div><span>Artwork</span></div>
                <div className="cp-card"><div className="scene--cp-roller" style={{width:'100%',height:'100%',position:'relative'}}><div className="blind-slats"></div></div><span>Roller Blinds</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section hiw" id="how-it-works">
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag section-tag--light">OUR PROCESS</span>
            <h2 className="section-title section-title--white">HOW IT <span style={{color:'var(--gold)'}}>WORKS</span></h2>
            <p className="section-desc section-desc--light">From your idea to your window — four simple steps.</p>
          </div>
          <div className="hiw-steps">
            <div className="hiw-step animate-in"><div className="hiw-step__num">01</div><div className="hiw-step__body"><h3>MEASURE YOUR WINDOWS</h3><p>Measure width and height. We&apos;ll send our measuring guide when you request a quote. Or book a free in-person consultation in Edmonton.</p></div></div>
            <div className="hiw-step animate-in"><div className="hiw-step__num">02</div><div className="hiw-step__body"><h3>CHOOSE YOUR DESIGN</h3><p>Browse the gallery, use the preview tool to upload your own image, or select one of our curated designs. See it on your window before you order.</p></div></div>
            <div className="hiw-step animate-in"><div className="hiw-step__num">03</div><div className="hiw-step__body"><h3>WE PRINT &amp; CRAFT</h3><p>Your image is UV-printed at full resolution on premium blind fabric, then cut and assembled to your exact measurements with commercial-grade hardware.</p></div></div>
            <div className="hiw-step animate-in"><div className="hiw-step__num">04</div><div className="hiw-step__body"><h3>DELIVERED TO YOUR DOOR</h3><p>Ships to you anywhere in Canada with all installation hardware included. Installation support available on request.</p></div></div>
          </div>
          <div style={{textAlign:'center',marginTop:'40px'}}>
            <Link href="/about" className="btn btn--outline-white btn--lg">Learn More About Us</Link>
          </div>
        </div>
      </section>

      {/* BUSINESS CTA */}
      <section className="section business">
        <div className="container">
          <div className="business__inner">
            <div className="business__text animate-in">
              <span className="section-tag section-tag--light">FOR BUSINESSES</span>
              <h2 className="section-title section-title--white">BRANDED BLINDS FOR<br/>COMMERCIAL SPACES</h2>
              <p className="business__desc">Offices, restaurants, retailers, hotels — we outfit commercial spaces of any size with custom branded window treatments. Logo printing, large quantities, professional results.</p>
              <div className="business__features">
                <div className="business__feat"><span>✓</span> Logo &amp; brand printing</div>
                <div className="business__feat"><span>✓</span> Large quantity orders</div>
                <div className="business__feat"><span>✓</span> Commercial-grade fabrics</div>
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

      {/* TESTIMONIALS */}
      <section className="section testimonials" style={{background:'var(--off-white)'}}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">CUSTOMER REVIEWS</span>
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
              <blockquote className="testimonial-card__quote">&ldquo;Ordered blackout blinds for all 4 bedrooms. Everything fit perfectly and the quality is fantastic. Communication was great throughout.&rdquo;</blockquote>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{background:'linear-gradient(135deg,#1A0050,#1341A0)'}}>JM</div>
                <div><strong>Jennifer M.</strong><span>Sherwood Park, AB</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-final">
        <div className="container">
          <div className="cta-final__inner animate-in">
            <span className="section-tag section-tag--light">GET STARTED</span>
            <h2 className="section-title section-title--white">READY TO TRANSFORM<br/><span style={{color:'var(--gold)'}}>YOUR WINDOWS?</span></h2>
            <p className="section-desc section-desc--light">Request a free quote and one of our team members will be in touch within one business day.</p>
            <div className="cta-final__btns">
              <Link href="/quote" className="btn btn--gold btn--xl btn--animated">Get a Free Quote</Link>
              <Link href="/shop?tab=custom" className="btn btn--outline-white btn--xl">★ Shop Custom Printed</Link>
            </div>
            <div className="cta-final__contact">
              <a href="mailto:info@visionprintedblinds.ca"><svg viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/><path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2"/></svg>info@visionprintedblinds.ca</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
