'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

interface GalleryItem { scene: string; title: string; cat: string; tall?: boolean; image?: string; }

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
  { scene:'gi--radha-krishna', title:'Radha Krishna Devotional Print', cat:'spiritual', tall:true, image:'/images/gallery/radha-krishna.jpg' },
  { scene:'gi--kids-boy',      title:'Custom Kids Name Design',        cat:'kids',      image:'/images/gallery/kids-graffiti-boy.jpg' },
  { scene:'gi--princess',      title:'Little Princess',                cat:'kids',      tall:true, image:'/images/gallery/little-princess.jpg' },
  { scene:'gi--angel-baby',    title:'A Little Angel',                 cat:'kids',      image:'/images/gallery/angel-baby.jpg' },
  { scene:'gi--family-lake',   title:'A Whole Lot of Love',            cat:'family',    tall:true, image:'/images/gallery/family-lake-sunset.jpg' },
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

  const visible = useMemo(() => items.filter(i => cat==='all' || i.cat===cat), [cat]);
  const idx = lightbox ? visible.findIndex(i => i.scene === lightbox.scene) : -1;

  function nav(delta: number) {
    if (idx < 0) return;
    const next = (idx + delta + visible.length) % visible.length;
    setLightbox(visible[next]);
  }

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
            <div className={`gallery-item__visual ${item.scene}`}>
              {item.image ? (
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 50vw, 25vw" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="blind-slats"></div>
              )}
            </div>
            <div className="gallery-item__overlay"><span>{item.title}</span></div>
          </div>
        ))}
      </div>

      {/* Lightbox — always mounted so the CSS fade transition (.lightbox.open) can play */}
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
    </>
  );
}
