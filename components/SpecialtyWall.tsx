'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import Lightbox from '@/components/Lightbox';

export interface SpecialtyPhoto {
  src: string;
  alt: string;
  sizes: string;
}

export default function SpecialtyWall({ photos }: { photos: SpecialtyPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = () => setIndex(null);
  const prev = () => setIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const next = () => setIndex((i) => (i === null ? null : (i + 1) % photos.length));

  return (
    <div
      className="cp-wall"
      onKeyDown={(e) => {
        if (index === null) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
      }}
    >
      {photos.map((photo, i) => (
        <button
          key={photo.src}
          type="button"
          className={`cp-wall__photo cp-wall__photo--${i + 1}`}
          onClick={() => setIndex(i)}
          aria-label={`View larger image: ${photo.alt}`}
        >
          <Image src={photo.src} alt={photo.alt} fill sizes={photo.sizes} style={{ objectFit: 'cover' }} />
        </button>
      ))}

      <AnimatePresence>
        {index !== null && (
          <Lightbox images={photos} index={index} onClose={close} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>
    </div>
  );
}
