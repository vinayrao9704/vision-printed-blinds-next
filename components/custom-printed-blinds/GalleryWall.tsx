'use client';

import { useRef, useState, useEffect, type RefObject } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import Lightbox from '@/components/Lightbox';

interface FramePreset {
  left: string;
  top: string;
  width: string;
  rotate: number;
  z: number;
  parallax: number;
}

/* Staggered "gallery wall" collage positions, cycled per image index. */
const FRAME_PRESETS: FramePreset[] = [
  { left: '2%',  top: '6%',  width: '44%', rotate: -2, z: 3, parallax: 0.5 },
  { left: '52%', top: '0%',  width: '30%', rotate: 3,  z: 2, parallax: -0.4 },
  { left: '74%', top: '32%', width: '23%', rotate: -3, z: 4, parallax: 0.55 },
  { left: '5%',  top: '54%', width: '27%', rotate: 2,  z: 2, parallax: -0.35 },
  { left: '34%', top: '58%', width: '34%', rotate: -1, z: 3, parallax: 0.4 },
  { left: '70%', top: '62%', width: '25%', rotate: 3,  z: 1, parallax: -0.5 },
  { left: '40%', top: '-4%', width: '18%', rotate: -3, z: 5, parallax: 0.3 },
];

const PLACEHOLDER_ICON = (
  <svg viewBox="0 0 24 24" fill="none"><path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" /><path d="m3 16 5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /><circle cx="8.5" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.4" /></svg>
);

function Frame({
  src,
  alt,
  index,
  preset,
  containerRef,
  hoveredIndex,
  onHover,
  onLeave,
  onClick,
  reduceMotion,
}: {
  src: string | null;
  alt: string;
  index: number;
  preset: FramePreset;
  containerRef: RefObject<HTMLDivElement | null>;
  hoveredIndex: number | null;
  onHover: () => void;
  onLeave: () => void;
  onClick?: () => void;
  reduceMotion: boolean;
}) {
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [preset.parallax * -60, preset.parallax * 60]);

  const isHovered = hoveredIndex === index;
  const isDimmed = hoveredIndex !== null && !isHovered;

  return (
    <motion.div
      className={`cpb-frame${isHovered ? ' cpb-frame--hovered' : ''}${isDimmed ? ' cpb-frame--dimmed' : ''}${src ? '' : ' cpb-frame--empty'}`}
      style={{ left: preset.left, top: preset.top, width: preset.width, zIndex: isHovered ? 10 : preset.z, y }}
      initial={{ opacity: 0, scale: 0.85, rotate: preset.rotate }}
      whileInView={{ opacity: 1, scale: 1, rotate: preset.rotate }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: reduceMotion ? 0 : index * 0.12, ease: 'easeOut' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={src ? onHover : undefined}
      onBlur={src ? onLeave : undefined}
      onClick={src ? onClick : undefined}
      role={src ? 'button' : undefined}
      tabIndex={src ? 0 : undefined}
      onKeyDown={src ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(); } } : undefined}
      aria-label={src ? `View larger image: ${alt}, printed on a custom roller blind` : undefined}
      aria-hidden={src ? undefined : true}
    >
      <span className="cpb-frame__rail" aria-hidden="true" />
      <span className="cpb-frame__fabric">
        {src ? (
          <img src={src} alt={alt} loading="lazy" />
        ) : (
          <span className="cpb-frame__placeholder">
            <span className="cpb-frame__placeholder-icon" aria-hidden="true">{PLACEHOLDER_ICON}</span>
            <span className="cpb-frame__placeholder-label">Image coming soon</span>
          </span>
        )}
        <span className="cpb-frame__texture" aria-hidden="true" />
      </span>
      <span className="cpb-frame__bar" aria-hidden="true" />
    </motion.div>
  );
}

export default function GalleryWall({ slides }: { slides: { src: string | null; alt: string }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const realSlides = slides.filter((s): s is { src: string; alt: string } => Boolean(s.src));

  const openLightbox = (src: string) => {
    const i = realSlides.findIndex((s) => s.src === src);
    if (i >= 0) setLightboxIndex(i);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i === null ? null : (i - 1 + realSlides.length) % realSlides.length));
  const next = () => setLightboxIndex((i) => (i === null ? null : (i + 1) % realSlides.length));

  // On the mobile slider layout (see the ≤900px rules in
  // custom-printed-blinds.css), slowly auto-pan the strip to the left so it
  // reads as a moving slider rather than a static row. Pauses while the
  // visitor is touching/dragging it, and is fully off for reduced motion.
  useEffect(() => {
    if (reduceMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const mq = window.matchMedia('(max-width: 900px)');
    let active = mq.matches;
    let paused = false;
    let raf = 0;
    let lastTime: number | null = null;
    let pos = el.scrollLeft; // tracked in JS float — el.scrollLeft itself rounds to
                              // whole pixels, so reading it back each frame would
                              // truncate sub-pixel increments before they can add up
    const SPEED = 18; // px per second — slow drift

    const tick = (time: number) => {
      if (lastTime === null) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (active && !paused) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 1) {
          pos += SPEED * dt;
          if (pos >= maxScroll) pos = 0;
          el.scrollLeft = pos;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => { paused = true; };
    const resume = () => { pos = el.scrollLeft; paused = false; };
    const onMqChange = (e: MediaQueryListEvent) => { active = e.matches; };

    el.addEventListener('pointerdown', pause);
    el.addEventListener('pointerup', resume);
    el.addEventListener('pointercancel', resume);
    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    mq.addEventListener('change', onMqChange);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('pointerup', resume);
      el.removeEventListener('pointercancel', resume);
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      mq.removeEventListener('change', onMqChange);
    };
  }, [reduceMotion]);

  return (
    <div className="cpb-gallery" ref={containerRef} onKeyDown={(e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }}>
      {slides.map((slide, i) => (
        <Frame
          key={`${slide.alt}-${i}`}
          src={slide.src}
          alt={slide.alt}
          index={i}
          preset={FRAME_PRESETS[i % FRAME_PRESETS.length]}
          containerRef={containerRef}
          hoveredIndex={hoveredIndex}
          onHover={() => setHoveredIndex(i)}
          onLeave={() => setHoveredIndex(null)}
          onClick={slide.src ? () => openLightbox(slide.src!) : undefined}
          reduceMotion={reduceMotion}
        />
      ))}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox images={realSlides} index={lightboxIndex} onClose={closeLightbox} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>
    </div>
  );
}
