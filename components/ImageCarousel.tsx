'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import type { GallerySlide } from '@/lib/productCategories';

export default function ImageCarousel({ slides }: { slides: GallerySlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  }, []);

  // Keep the dot indicators in sync with native swipe/scroll (touch, trackpad, or arrows).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const slideWidth = track.children[0]?.clientWidth || 1;
        const i = Math.round(track.scrollLeft / slideWidth);
        setActive(Math.max(0, Math.min(slides.length - 1, i)));
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => { track.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [slides.length]);

  const prev = () => scrollToIndex(Math.max(0, active - 1));
  const next = () => scrollToIndex(Math.min(slides.length - 1, active + 1));

  return (
    <div className="img-carousel">
      <button type="button" className="img-carousel__arrow img-carousel__arrow--prev" aria-label="Previous image" onClick={prev} disabled={active === 0}>
        <svg viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <div className="img-carousel__track" ref={trackRef} tabIndex={0} role="region" aria-label="Image gallery, scrollable">
        {slides.map((s, i) => (
          <div className="img-carousel__slide" key={s.alt + i}>
            {s.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.image} alt={s.alt} loading="lazy" className="img-carousel__img" />
            ) : (
              <div className={`img-carousel__scene ${s.scene}`} role="img" aria-label={s.alt}><div className="blind-slats"></div></div>
            )}
          </div>
        ))}
      </div>

      <button type="button" className="img-carousel__arrow img-carousel__arrow--next" aria-label="Next image" onClick={next} disabled={active === slides.length - 1}>
        <svg viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>

      <div className="img-carousel__dots" role="tablist" aria-label="Gallery navigation">
        {slides.map((s, i) => (
          <button
            key={s.alt + i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`Go to image ${i + 1}`}
            className={`img-carousel__dot${active === i ? ' active' : ''}`}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
