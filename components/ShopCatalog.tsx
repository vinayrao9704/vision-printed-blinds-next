'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { products, tagLabels, type Product } from '@/lib/products';

const tabs = [
  { id:'all', label:'All Products' },
  { id:'custom', label:'★ Custom Printed' },
  { id:'roller', label:'Roller Shades' },
  { id:'zebra', label:'Zebra Shades' },
  { id:'blackout', label:'Blackout' },
  { id:'solar', label:'Solar Shades' },
  { id:'curtains', label:'Curtains & Drapes' },
  { id:'motorized', label:'Motorized' },
  { id:'specialty', label:'Specialty' },
  { id:'commercial', label:'Commercial' },
];

const filters = [
  { id:'all', label:'All' },
  { id:'custom-print', label:'Custom Printed' },
  { id:'blackout', label:'Blackout' },
  { id:'motorized', label:'Motorized' },
  { id:'smart-home', label:'Smart Home' },
  { id:'commercial', label:'Commercial' },
  { id:'residential', label:'Residential' },
  { id:'large-window', label:'Large Windows' },
  { id:'privacy', label:'Privacy' },
];

const GOLD_TAGS = new Set(['custom-print', 'motorized', 'smart-home']);

export function detailRows(p: Product): [string, string][] {
  const rows: [string, string][] = [];
  if (p.tags.includes('custom-print')) rows.push(['Print Type', 'High-quality custom print on premium fabric']);
  if (p.tags.includes('blackout')) rows.push(['Light Control', 'Full blackout (100% light blocking)']);
  else if (p.tags.includes('light-filter')) rows.push(['Light Control', 'Light filtering (diffuses natural light)']);
  else if (p.tags.includes('uv')) rows.push(['Light Control', 'Solar / glare reduction with UV protection']);
  if (p.tags.includes('motorized')) {
    rows.push(['Operation', 'Motorized (includes remote control)']);
    rows.push(['Smart Home', 'Compatible with Alexa & Google Home']);
  } else {
    rows.push(['Operation', 'Manual (cordless or corded)']);
  }
  if (p.tags.includes('custom-size')) rows.push(['Sizing', 'Custom-made to your exact measurements']);
  if (p.tags.includes('commercial')) rows.push(['Use Case', 'Commercial grade, suitable for business use']);
  return rows;
}

function TagChip({ tag }: { tag: string }) {
  return <span className={`pcard__tag${GOLD_TAGS.has(tag) ? ' pcard__tag--gold' : ''}`}>{tagLabels[tag] ?? tag}</span>;
}

const TAB_IDS = new Set(tabs.map(t => t.id));
const FILTER_IDS = new Set(filters.map(f => f.id));

export default function ShopCatalog() {
  const searchParams = useSearchParams();
  const urlTab = searchParams.get('tab');
  const urlFilter = searchParams.get('filter');
  const urlHighlight = searchParams.get('highlight');

  const [tab, setTab] = useState(() => (urlTab && TAB_IDS.has(urlTab)) ? urlTab : 'all');
  const [filter, setFilter] = useState(() => (urlFilter && FILTER_IDS.has(urlFilter)) ? urlFilter : 'all');
  const [highlightId, setHighlightId] = useState<string | null>(urlHighlight);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const visible = useMemo(() => products.filter(p => {
    const matchTab = tab==='all' || p.category.includes(tab);
    const matchFilter = filter==='all' || p.tags.includes(filter);
    return matchTab && matchFilter;
  }), [tab, filter]);

  // Nav lives in the root layout, so clicking a different mega-menu item while
  // already on /shop (or after using the tool once) is a client-side navigation
  // that re-renders this same mounted component with new searchParams — it does
  // NOT remount it. Without this effect, the useState above only applies the URL
  // on the very first mount and every later deep link is silently ignored.
  useEffect(() => {
    setTab((urlTab && TAB_IDS.has(urlTab)) ? urlTab : 'all');
    setFilter((urlFilter && FILTER_IDS.has(urlFilter)) ? urlFilter : 'all');
    setHighlightId(urlHighlight);
  }, [urlTab, urlFilter, urlHighlight]);

  // Scroll the deep-linked product into view and pulse it briefly so it's
  // obvious which item the menu link was pointing at, not just which tab.
  // Depends on `tab` (not just `urlHighlight`) so this only runs once the tab
  // state above has actually settled and re-rendered with the right product
  // in the DOM — otherwise cardRefs would still reflect the previous tab's
  // list on a same-pass read, before React commits the new tab's render.
  useEffect(() => {
    if (!urlHighlight) return;
    const el = cardRefs.current[urlHighlight];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const timer = setTimeout(() => setHighlightId(null), 2600);
    return () => clearTimeout(timer);
  }, [tab, urlHighlight]);

  return (
    <>
      <div className="shop-tabs" id="shopTabs">
        {tabs.map(t => (
          <button key={t.id} className={`shop-tab${tab===t.id?' active':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className="filter-bar" id="filterBar">
        <span className="filter-bar__label">Filter:</span>
        {filters.map(f => (
          <button key={f.id} className={`fchip${filter===f.id?' active':''}`} onClick={()=>setFilter(f.id)}>{f.label}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="shop-empty">
          <p>No products match your filters. <button className="link-btn" onClick={()=>{setTab('all');setFilter('all');}}>Clear all filters</button></p>
        </div>
      ) : (
        <div className="products-grid" id="productsGrid">
          {visible.map(p => (
            <div
              className={`pcard${highlightId === p.id ? ' pcard--highlight' : ''}`}
              key={p.id}
              ref={(el) => { cardRefs.current[p.id] = el; }}
            >
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
                  {p.tags.map(t => <TagChip tag={t} key={t}/>)}
                </div>
                <div className="pcard__ctas">
                  <Link href={`/shop/${p.id}`} className="btn btn--navy">View Details</Link>
                  <Link href="/quote" className="btn btn--gold">Get Quote</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
