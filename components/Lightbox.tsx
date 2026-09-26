'use client';

import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

export interface LightboxImage {
  src: string;
  alt: string;
}

export default function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const current = images[index];
  // Portalled straight to <body>: several sections on this site give their
  // inner wrapper a `position: relative; z-index: 1` (e.g. .cp-hero__inner),
  // which creates its own stacking context and would otherwise cap this
  // modal below the fixed nav (z-index 1000) no matter what z-index it's
  // given locally.
  return createPortal(
    <motion.div
      className="cpb-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button type="button" className="cpb-lightbox__close" onClick={onClose} aria-label="Close">&times;</button>
      {images.length > 1 && (
        <button
          type="button"
          className="cpb-lightbox__nav cpb-lightbox__nav--prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous image"
        >
          &#8249;
        </button>
      )}
      <motion.img
        key={current.src}
        src={current.src}
        alt={current.alt}
        className="cpb-lightbox__img"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
      />
      {images.length > 1 && (
        <button
          type="button"
          className="cpb-lightbox__nav cpb-lightbox__nav--next"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next image"
        >
          &#8250;
        </button>
      )}
    </motion.div>,
    document.body
  );
}
