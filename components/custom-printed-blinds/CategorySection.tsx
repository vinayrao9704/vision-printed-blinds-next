'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { CustomPrintCategory } from '@/lib/customPrintedBlinds';
import { useReducedMotion } from '@/lib/useReducedMotion';
import GalleryWall from './GalleryWall';

const FEATURE_ICON = (
  <svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

export default function CategorySection({
  category,
  slides,
}: {
  category: CustomPrintCategory;
  slides: { src: string | null; alt: string }[];
}) {
  const reduceMotion = useReducedMotion();
  const photosLeft = category.imageLayout === 'left';
  const slideFrom = photosLeft ? 40 : -40;

  const details = (
    <motion.div
      className="cpb-section__details"
      initial={{ opacity: 0, x: reduceMotion ? 0 : slideFrom }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <span className="cpb-section__index">{category.index}</span>
      <h2 className="cpb-section__heading">{category.heading}</h2>
      <p className="cpb-section__desc">{category.description}</p>
      <ul className="feature-list cpb-section__features">
        {category.features.map((f) => (
          <li key={f}>
            <span className="feature-list__icon" aria-hidden="true">{FEATURE_ICON}</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link href="/quote" className="btn btn--gold btn--animated">Get a Quote for This Design</Link>
    </motion.div>
  );

  const gallery = (
    <div className="cpb-section__gallery">
      <GalleryWall slides={slides} />
    </div>
  );

  return (
    <section id={category.id} className={`cpb-section${photosLeft ? ' cpb-section--photos-left' : ' cpb-section--photos-right'}`}>
      <div className="container cpb-section__inner">
        {photosLeft ? (
          <>
            {gallery}
            {details}
          </>
        ) : (
          <>
            {details}
            {gallery}
          </>
        )}
      </div>
    </section>
  );
}
