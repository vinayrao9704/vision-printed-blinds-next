'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { tagLabels } from '@/lib/products';
import { detailRows } from '@/components/ShopCatalog';

const COLOR_OPTIONS = [
  { name: 'Black', hex: '#1C1C1E' },
  { name: 'Grey', hex: '#9CA3AF' },
  { name: 'Sand', hex: '#C9B48C' },
];

type Mount = 'inside' | 'outside';

function MountIcon({ mount }: { mount: Mount }) {
  return mount === 'inside' ? (
    <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.6" /><rect x="8" y="8" width="8" height="8" fill="currentColor" opacity="0.25" /></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none"><rect x="7" y="7" width="10" height="10" fill="currentColor" opacity="0.25" /><rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 2" /></svg>
  );
}

export default function ProductConfigurator({ product }: { product: Product }) {
  const [color, setColor] = useState(COLOR_OPTIONS[0].name);
  const [mount, setMount] = useState<Mount>('inside');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  const quoteHref = `/quote?product=${encodeURIComponent(product.name)}&color=${encodeURIComponent(color)}&mount=${mount}${width ? `&width=${encodeURIComponent(width)}` : ''}${height ? `&height=${encodeURIComponent(height)}` : ''}`;

  return (
    <section className="section pdp" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        <div className="page-breadcrumb" style={{ marginBottom: '24px' }}>
          <Link href="/">Home</Link> &rsaquo; <Link href="/shop">Shop</Link> &rsaquo; {product.name}
        </div>

        <div className="pdp-grid">
          {/* ===== Left: media + overview ===== */}
          <div className="pdp-media">
            <div className="pdp-media__frame">
              {product.image ? (
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 55vw" style={{ objectFit: 'cover' }} priority />
              ) : (
                <div className={`pdp-media__scene ${product.scene}`}><div className="blind-slats"></div></div>
              )}
              {product.badge && <div className="pdp-media__badge">{product.badge}</div>}
            </div>

            <div className="pdp-overview">
              <h2>Product Overview</h2>
              <p>{product.desc}</p>
              <div className="pdp-tags">
                {product.tags.map((t) => (
                  <span key={t} className={`pcard__tag${['custom-print', 'motorized', 'smart-home'].includes(t) ? ' pcard__tag--gold' : ''}`}>{tagLabels[t] ?? t}</span>
                ))}
              </div>
              <div className="pm-detail-grid" style={{ marginTop: '20px' }}>
                {detailRows(product).map(([label, value]) => (
                  <div className="pm-detail-row" key={label}>
                    <span className="pm-detail-label">{label}</span>
                    <span className="pm-detail-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Right: configurator ===== */}
          <div className="pdp-configure">
            <h1 className="pdp-title">{product.name}</h1>
            <p className="pdp-subtitle">Configure your custom order — we&apos;ll send you a free, no-obligation quote.</p>

            <div className="pdp-card">
              <h3 className="pdp-card__head"><span className="pdp-card__num">1</span> Select Color</h3>
              <div className="pdp-colors" role="group" aria-label="Select color">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`pdp-color-swatch${color === c.name ? ' active' : ''}`}
                    style={{ background: c.hex }}
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                    onClick={() => setColor(c.name)}
                  />
                ))}
              </div>
              <p className="pdp-selected-label">Selected Color: <strong>{color}</strong></p>
            </div>

            <div className="pdp-card">
              <h3 className="pdp-card__head"><span className="pdp-card__num">2</span> Mount Type</h3>
              <div className="pdp-mount-grid" role="group" aria-label="Mount type">
                <button type="button" className={`pdp-mount-card${mount === 'inside' ? ' active' : ''}`} aria-pressed={mount === 'inside'} onClick={() => setMount('inside')}>
                  <MountIcon mount="inside" />
                  <strong>Inside Mount</strong>
                  <span>Fits inside window frame</span>
                </button>
                <button type="button" className={`pdp-mount-card${mount === 'outside' ? ' active' : ''}`} aria-pressed={mount === 'outside'} onClick={() => setMount('outside')}>
                  <MountIcon mount="outside" />
                  <strong>Outside Mount</strong>
                  <span>Mounts on wall above</span>
                </button>
              </div>
            </div>

            <div className="pdp-card">
              <h3 className="pdp-card__head"><span className="pdp-card__num">3</span> Enter Measurements</h3>
              <div className="pdp-measure-grid">
                <div className="pdp-field">
                  <label htmlFor="pdpWidth">Width (inches)</label>
                  <input id="pdpWidth" className="qf-input" type="number" min={1} placeholder="e.g. 24" value={width} onChange={(e) => setWidth(e.target.value)} />
                </div>
                <div className="pdp-field">
                  <label htmlFor="pdpHeight">Height (inches)</label>
                  <input id="pdpHeight" className="qf-input" type="number" min={1} placeholder="e.g. 36" value={height} onChange={(e) => setHeight(e.target.value)} />
                </div>
              </div>
              <p className="pdp-measure-hint">Not sure how to measure? See our <Link href="/measure-guide">measuring guide</Link>.</p>
            </div>

            <Link href={quoteHref} className="btn btn--gold btn--xl pdp-cta">Get a Free Quote</Link>

            <div className="pdp-info-card">
              <h4>💬 Free Expert Consultation</h4>
              <p>Not sure what size or fabric to choose? Talk to our team and find the perfect fit for your home.</p>
              <Link href="/quote">Chat with Us →</Link>
            </div>

            <div className="pdp-info-card">
              <h4>🛡️ Measurement Support</h4>
              <p>We review every measurement with you before production starts, so there are no surprises when your blind arrives.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
