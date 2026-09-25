import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { products, tagLabels } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Custom Printed Blinds',
  description: 'Any photo, design, logo, or artwork — printed at full UV quality on premium blind fabric and made to fit your exact window.',
};

const GOLD_TAGS = new Set(['custom-print', 'motorized', 'smart-home']);

export default function CustomPrintedPage() {
  const customProducts = products.filter((p) => p.category.includes('custom'));

  return (
    <>
      <section className="page-hero page-hero--custom">
        <div className="page-hero__bg"></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link> &rsaquo; Custom Printed Blinds</div>
          <span className="section-tag section-tag--light">★ OUR SPECIALTY</span>
          <h1 className="page-hero__title">CUSTOM PRINTED<br/><span className="text-gold">BLINDS</span></h1>
          <p className="page-hero__desc">Any photo, design, logo, or artwork — printed at full UV quality on premium blind fabric and made to fit your exact window.</p>
          <Link href="/quote" className="btn btn--gold btn--lg btn--animated">Get Your Free Estimate</Link>
        </div>
      </section>

      <section id="custom-printed" className="section shop">
        <div className="container">
          <div className="products-grid" id="customProductsGrid">
            {customProducts.map((p) => (
              <div className="pcard" key={p.id}>
                <div className="pcard__visual">
                  {p.image ? (
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" style={{ objectFit: 'cover' }} className="pcard__photo" />
                  ) : (
                    <div className={`pcard__scene ${p.scene}`}><div className="blind-slats"></div></div>
                  )}
                  {p.badge && <div className="pcard__badge">{p.badge}</div>}
                </div>
                <div className="pcard__body">
                  <h3 className="pcard__name">{p.name}</h3>
                  <p className="pcard__desc">{p.desc}</p>
                  <div className="pcard__tags">
                    {p.tags.map((t) => (
                      <span key={t} className={`pcard__tag${GOLD_TAGS.has(t) ? ' pcard__tag--gold' : ''}`}>{tagLabels[t] ?? t}</span>
                    ))}
                  </div>
                  <div className="pcard__ctas">
                    <Link href={`/shop/${p.id}`} className="btn btn--navy">View Details</Link>
                    <Link href="/quote" className="btn btn--gold">Get Quote</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-final">
        <div className="container">
          <div className="cta-final__inner animate-in">
            <h2 className="section-title section-title--white">Ready to print your own design?</h2>
            <div className="cta-final__btns">
              <Link href="/quote" className="btn btn--gold btn--xl btn--animated">Get Your Free Estimate</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
