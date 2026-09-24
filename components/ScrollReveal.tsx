'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Ports script.js's scroll-reveal IntersectionObserver to React.
 * .animate-in elements start at opacity:0 (see styles.css) and only
 * become visible once this adds .visible — without it every such
 * element stays invisible forever, which is why whole sections looked
 * "missing" on every page.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    // Run after paint so newly-mounted elements for this route exist in the DOM.
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll('.animate-in').forEach((el) => {
        if (!el.classList.contains('visible')) observer.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
