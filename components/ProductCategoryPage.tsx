import Link from 'next/link';
import Image from 'next/image';
import type { ProductCategory } from '@/lib/productCategories';
import ImageCarousel from '@/components/ImageCarousel';

export default function ProductCategoryPage({ category }: { category: ProductCategory }) {
  return (
    <>
      {/* 2. HERO */}
      <section className="page-hero page-hero--blind-category">
        <div className="page-hero__bg">
          {category.heroImage && (
            <Image src={category.heroImage} alt={category.name} fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
          )}
          <div className="blind-slats"></div>
        </div>
        <div className="page-hero__overlay page-hero__overlay--dark"></div>
        <div className="container page-hero__inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link> &rsaquo; {category.name}</div>
          <span className="section-tag section-tag--light">{category.heroTagline}</span>
          <h1 className="page-hero__title">{category.name}</h1>
          <p className="page-hero__desc">{category.heroIntro}</p>
          <Link href="/quote" className="btn btn--gold btn--lg btn--animated">Get Your Free Estimate</Link>
        </div>
      </section>

      {/* 3. ABOUT */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="about-split about-split--product animate-in">
            <div className="about-split__text">
              <span className="section-tag">ABOUT {category.name.toUpperCase()}</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginLeft: 0 }}>{category.aboutHeadline || category.name}</h2>
              {category.aboutParagraphs.map((p) => (
                <p key={p} style={{ color: 'var(--text-mid)', lineHeight: 1.75, marginBottom: '18px' }}>{p}</p>
              ))}
              <h3 className="pdp-card__head--plain">Key Features</h3>
              <ul className="feature-list">
                {category.aboutBullets.map((b) => (
                  <li key={b}>
                    <span className="feature-list__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="about-split__visual animate-in">
              <div className="split-visual">
                {category.aboutImage ? (
                  <Image src={category.aboutImage} alt={`About ${category.name}`} fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={category.aboutScene} style={{ width: '100%', height: '100%', position: 'relative' }}><div className="blind-slats"></div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GALLERY CAROUSEL */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">GALLERY</span>
            <h2 className="section-title">{category.name.toUpperCase()} IN <span style={{ color: '#8A5A00' }}>EVERY ROOM</span></h2>
          </div>
          <ImageCarousel slides={category.gallery} />
        </div>
      </section>

      {/* 5. TYPES */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">OPTIONS</span>
            <h2 className="section-title">TYPES OF <span style={{ color: '#8A5A00' }}>{category.name.toUpperCase()}</span></h2>
          </div>
          <div className="products-grid">
            {category.types.map((t) => (
              <div className="pcard" key={t.title}>
                <div className="pcard__visual">
                  {t.image ? (
                    <Image src={t.image} alt={t.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" style={{ objectFit: 'cover' }} className="pcard__photo" />
                  ) : (
                    <div className={`pcard__scene ${t.scene}`}><div className="blind-slats"></div></div>
                  )}
                </div>
                <div className="pcard__body">
                  <h3 className="pcard__name">{t.title}</h3>
                  <p className="pcard__desc">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SAMPLE COLOURS */}
      <section className="section" style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">SAMPLE COLOURS</span>
            <h2 className="section-title">FIND YOUR <span style={{ color: '#8A5A00' }}>SHADE</span></h2>
          </div>
          <div className="colour-swatches">
            {category.colours.map((c) => (
              <div className="colour-swatch" key={c.name}>
                <span className="colour-swatch__circle" style={{ background: c.hex }} />
                <span className="colour-swatch__label">{c.name}</span>
              </div>
            ))}
          </div>
          <p className="colour-swatches__note">Many more colours and textures available. Ask us for samples.</p>
        </div>
      </section>

      {/* 7. HARDWARE & OPERATING OPTIONS */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="section-header animate-in">
            <span className="section-tag">HARDWARE</span>
            <h2 className="section-title">HARDWARE &amp; <span style={{ color: '#8A5A00' }}>OPERATING OPTIONS</span></h2>
          </div>
          <div className="vp-grid">
            {category.hardware.map((h) => (
              <div className="vp-card animate-in" key={h.title}>
                <h3>{h.title}</h3>
                <ul className="hardware-list">
                  {h.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WARRANTY */}
      <section className="section warranty-banner">
        <div className="container">
          <div className="warranty-banner__inner animate-in">
            <div className="warranty-banner__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h2 className="section-title section-title--white">{category.warrantyHeading}</h2>
            <p className="warranty-banner__text">{category.warrantyText}</p>
          </div>
        </div>
      </section>

      {/* 9. CLOSING CTA */}
      <section className="cta-final">
        <div className="container">
          <div className="cta-final__inner animate-in">
            <h2 className="section-title section-title--white">{category.closingHeading}</h2>
            <div className="cta-final__btns">
              <Link href="/quote" className="btn btn--gold btn--xl btn--animated">Get Your Free Estimate</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
