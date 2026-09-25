'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface GalleryItem {
  scene: string;
  title: string;
  cat: string;
  tall?: boolean;
  image?: string;
  /** Natural pixel dimensions of `image` — lets the grid box grow to the
   *  photo's real aspect ratio instead of cropping it to a fixed height. */
  imageWidth?: number;
  imageHeight?: number;
}

const items: GalleryItem[] = [
  { scene:'gi--mountain1', title:'Rocky Mountain Sunrise', cat:'mountain' },
  { scene:'gi--beach1',    title:'Tropical Paradise',      cat:'beach', tall:true },
  { scene:'gi--sunflower', title:'Sunflower Field',        cat:'flowers' },
  { scene:'gi--lake',      title:'Lake Louise',            cat:'mountain' },
  { scene:'gi--branding',  title:'Corporate Branding',     cat:'branding', tall:true },
  { scene:'gi--space',     title:'Space Adventure',        cat:'kids' },
  { scene:'gi--family',    title:'Family Memories',        cat:'family' },
  { scene:'gi--beach2',    title:'Ocean Sunset',           cat:'beach' },
  { scene:'gi--rockies',   title:'Canadian Rockies',       cat:'mountain', tall:true },
  { scene:'gi--blossom',   title:'Cherry Blossom',         cat:'flowers' },
  { scene:'gi--smart',     title:'Smart Home Setup',       cat:'motorized' },
  { scene:'gi--solar',     title:'Solar Shade Living Room',cat:'solar' },
  { scene:'gi--radha-krishna', title:'Radha Krishna Devotional Print', cat:'spiritual', image:'/images/gallery/radha-krishna.jpg', imageWidth:1326, imageHeight:1186 },
  { scene:'gi--kids-boy',      title:'Custom Kids Name Design',        cat:'kids',      image:'/images/gallery/kids-graffiti-boy.jpg', imageWidth:1402, imageHeight:1122 },
  { scene:'gi--princess',      title:'Little Princess',                cat:'kids',      image:'/images/gallery/little-princess.jpg', imageWidth:1536, imageHeight:1024 },
  { scene:'gi--angel-baby',    title:'A Little Angel',                 cat:'kids',      image:'/images/gallery/angel-baby.jpg', imageWidth:1024, imageHeight:1536 },
  { scene:'gi--family-lake',   title:'A Whole Lot of Love',            cat:'family',    image:'/images/gallery/family-lake-sunset.jpg', imageWidth:1374, imageHeight:1145 },
];

const filters = [
  { id:'all', label:'All' },
  { id:'mountain', label:'Mountain & Nature' },
  { id:'beach', label:'Beach & Travel' },
  { id:'family', label:'Family Photos' },
  { id:'flowers', label:'Flowers & Patterns' },
  { id:'kids', label:'Kids & Nursery' },
  { id:'spiritual', label:'Spiritual & Religious' },
  { id:'branding', label:'Business & Branding' },
  { id:'motorized', label:'Motorized' },
  { id:'solar', label:'Solar Shades' },
];

export default function GalleryGrid() {
  const [cat, setCat] = useState('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const visible = useMemo(() => items.filter(i => cat==='all' || i.cat===cat), [cat]);
  const idx = lightbox ? visible.findIndex(i => i.scene === lightbox.scene) : -1;

  function nav(delta: number) {
    if (idx < 0) return;
    const next = (idx + delta + visible.length) % visible.length;
    setLightbox(visible[next]);
  }

  const lightboxEl = (
    <div className={`lightbox${lightbox ? ' open' : ''}`} role="dialog" aria-modal="true" aria-hidden={!lightbox}>
      <button className="lightbox__close" onClick={()=>setLightbox(null)} aria-label="Close">&times;</button>
      <button className="lightbox__prev" onClick={()=>nav(-1)} aria-label="Previous image">&#8249;</button>
      <div className="lightbox__stage">
        {lightbox && (
          <div className={`gallery-item__visual ${lightbox.scene}`} style={{width:'min(80vw,700px)',height:'min(60vh,500px)'}}>
            {lightbox.image ? (
              <Image src={lightbox.image} alt={lightbox.title} fill sizes="700px" style={{ objectFit: 'contain' }} />
            ) : (
              <div className="blind-slats"></div>
            )}
          </div>
        )}
      </div>
      <button className="lightbox__next" onClick={()=>nav(1)} aria-label="Next image">&#8250;</button>
      <p className="lightbox__caption">{lightbox?.title}</p>
    </div>
  );

  return (
    <>
      <div className="gallery-filters">
        {filters.map(f => (
          <button key={f.id} className={`gallery-filter${cat===f.id?' active':''}`} onClick={()=>setCat(f.id)}>{f.label}</button>
        ))}
      </div>
      <div className="gallery-masonry">
        {visible.map(item => (
          <div
            className={`gallery-item${item.tall?' gallery-item--tall':''}`}
            key={item.scene}
            onClick={()=>setLightbox(item)}
          >
            <div className={`gallery-item__visual ${item.scene}${item.image ? ' gallery-item__visual--photo' : ''}`}>
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  width={item.imageWidth}
                  height={item.imageHeight}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              ) : (
                <div className="blind-slats"></div>
              )}
            </div>
            <div className="gallery-item__overlay"><span>{item.title}</span></div>
          </div>
        ))}
      </div>

      {/* Lightbox — always mounted so the CSS fade transition (.lightbox.open) can play.
          Portaled to document.body so it's never a descendant of the masonry grid —
          keeps it reliably on top regardless of any stacking-context quirks from
          transformed/transitioning gallery items, instead of relying on z-index alone. */}
      {mounted ? createPortal(lightboxEl, document.body) : null}
    </>
  );
}
