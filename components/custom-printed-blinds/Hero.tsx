'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { customPrintCategories } from '@/lib/customPrintedBlinds';

const HEADLINE_WORDS = ['Your', 'Photo.', 'Your', 'Style.', 'Your', 'Window.'];

const QUICK_LINK_LABELS: Record<string, string> = {
  photo: 'Photo',
  landscape: 'Landscape',
  artwork: 'Artwork',
  kids: 'Kids',
  business: 'Business',
};

const QUICK_LINKS = customPrintCategories
  .filter((category) => category.enabled !== false)
  .map((category) => ({ href: `#${category.id}`, label: QUICK_LINK_LABELS[category.id] ?? category.label }));

export default function CustomPrintedHero({ heroImageSrc }: { heroImageSrc: string | null }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="cpb-hero">
      <motion.div
        className={`cpb-hero__bg${heroImageSrc ? '' : ' cpb-hero__bg--fallback'}`}
        initial={{ scale: 1 }}
        animate={reduceMotion || !heroImageSrc ? {} : { scale: 1.12 }}
        transition={reduceMotion || !heroImageSrc ? {} : { duration: 20, ease: 'linear' }}
      >
        {heroImageSrc && <img src={heroImageSrc} alt="Living room with a custom printed blind" />}
      </motion.div>
      <div className="cpb-hero__overlay" />

      <div className="container cpb-hero__inner">
        <motion.span
          className="section-tag section-tag--light"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          CUSTOM PRINTED BLINDS
        </motion.span>

        <h1 className="cpb-hero__title">
          {HEADLINE_WORDS.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="cpb-hero__word"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.15 + i * 0.09 }}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="cpb-hero__desc"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          Custom printed blinds made for homes, offices and businesses across Alberta.
        </motion.p>

        <motion.div
          className="cpb-hero__btns"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.05 }}
        >
          <Link href="/quote" className="btn btn--gold btn--lg btn--animated">Get a Free Quote</Link>
          <a href="#photo" className="btn btn--outline-white btn--lg">Explore Designs</a>
        </motion.div>

        <motion.nav
          className="cpb-hero__jump"
          aria-label="Jump to a design category"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {QUICK_LINKS.map((link, i) => (
            <span key={link.href} className="cpb-hero__jump-item">
              {i > 0 && <span className="cpb-hero__jump-dot" aria-hidden="true">&middot;</span>}
              <a href={link.href}>{link.label}</a>
            </span>
          ))}
        </motion.nav>
      </div>

      {!reduceMotion && (
        <motion.div
          className="cpb-hero__arrow"
          aria-hidden="true"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v15M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.div>
      )}
    </section>
  );
}
