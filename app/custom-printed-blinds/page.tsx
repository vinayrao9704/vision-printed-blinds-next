import type { Metadata } from 'next';
import Link from 'next/link';
import { customPrintCategories } from '@/lib/customPrintedBlinds';
import { publicImageExists } from '@/lib/publicImage';
import CustomPrintedHero from '@/components/custom-printed-blinds/Hero';
import CategorySection from '@/components/custom-printed-blinds/CategorySection';

export const metadata: Metadata = {
  title: 'Custom Printed Blinds in Edmonton',
  description: 'Turn your photos, artwork, landscapes, kids designs or business branding into custom printed blinds. Made for homes, offices and businesses across Alberta.',
};

// No stock photos are shipped with the page — drop real files into
// public/images/custom-printed/ using these same filenames (see
// lib/customPrintedBlinds.ts) and they'll appear automatically.
export default function CustomPrintedBlindsPage() {
  const heroImageSrc = publicImageExists('images/custom-printed/hero.webp') ? '/images/custom-printed/hero.webp' : null;

  return (
    <div className="cpb-page">
      <CustomPrintedHero heroImageSrc={heroImageSrc} />

      {customPrintCategories.filter((category) => category.enabled !== false).map((category) => {
        const slides = category.images.map((file, i) => {
          const relPath = `images/custom-printed/${file}`;
          return {
            src: publicImageExists(relPath) ? `/${relPath}` : null,
            alt: `${category.label} sample ${i + 1}`,
          };
        });
        return <CategorySection key={category.id} category={category} slides={slides} />;
      })}

      <section className="cta-final">
        <div className="container">
          <div className="cta-final__inner animate-in">
            <h2 className="section-title section-title--white">Ready to Transform Your Windows?</h2>
            <div className="cta-final__btns">
              <Link href="/quote" className="btn btn--gold btn--xl btn--animated">Get a Free Quote</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
