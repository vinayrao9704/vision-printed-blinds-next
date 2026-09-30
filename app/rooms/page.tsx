import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import RoomTabs from '@/components/RoomTabs';

export const metadata: Metadata = {
  title: 'Shop by Room',
  description: 'Find the right custom blind for every room: living rooms, bedrooms, kitchens, offices, nurseries, and commercial spaces.',
};

const needCards = [
  { scene:'scene--blackout-bedroom',   title:'BLACKOUT',              desc:'Complete light blocking for bedrooms, nurseries, and media rooms. Sleep better, watch better.', cta:'Shop Blackout →', href:'/shop' },
  { scene:'scene--roller-light',       title:'PRIVACY',               desc:'Maintain privacy without sacrificing style. Ideal for bedrooms, bathrooms, and street-facing windows.', cta:'Shop Privacy →', href:'/shop' },
  { scene:'scene--solar-residential',  title:'SUN & GLARE CONTROL',   desc:'Reduce glare and UV damage in bright rooms and offices while maintaining your view.', cta:'Shop Solar Shades →', href:'/shop' },
  { scene:'scene--motorized-smart',    title:'SMART HOME',            desc:'Alexa & Google Home compatible motorized blinds for effortless automated window control.', cta:'Shop Smart Blinds →', href:'/shop' },
  { scene:'scene--vertical',           title:'LARGE WINDOWS',         desc:'Vertical blinds, panel tracks, and wide roller options for large openings and patio doors.', cta:'Shop Wide Options →', href:'/shop' },
  { scene:'scene--cp-business',        title:'COMMERCIAL BRANDING',   desc:'Print your logo and brand graphics on your windows. Perfect for offices, stores, and restaurants.', cta:'Business Solutions →', href:'/quote' },
];

export default function RoomsPage() {
  // "By Room" is disabled for this release — planned for a future version.
  // Redirecting rather than deleting keeps the page below intact so it can
  // be re-enabled later by simply removing this redirect.
  redirect('/');

  return (
    <>
      <section className="page-hero page-hero--rooms">
        <div className="page-hero__bg"></div>
        <div className="page-hero__overlay"></div>
        <div className="container page-hero__inner">
          <div className="page-breadcrumb"><Link href="/">Home</Link> &rsaquo; Shop by Room</div>
          <span className="section-tag section-tag--light">EVERY SPACE COVERED</span>
          <h1 className="page-hero__title">FIND THE RIGHT<br/><span className="text-gold">BLIND FOR YOUR ROOM</span></h1>
          <p className="page-hero__desc">Every room has different needs. Browse by room type or skip ahead to shop by function below.</p>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <a href="#shop-by-room" className="btn btn--gold btn--lg">Browse by Room ↓</a>
            <a href="#need" className="btn btn--outline-white btn--lg">Shop by Need ↓</a>
          </div>
        </div>
      </section>

      <section id="shop-by-room" className="section shop-by-room">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">RESIDENTIAL &amp; COMMERCIAL</span>
            <h2 className="section-title">SHOP BY ROOM</h2>
            <p className="section-subtitle">Select your room type to find the best blind options, including custom printed choices.</p>
          </div>
          <RoomTabs />
        </div>
      </section>

      <section id="need" className="section shop-by-need">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">FIND BY FUNCTION</span>
            <h2 className="section-title">SHOP BY NEED</h2>
            <p className="section-subtitle">Know what you need? Start here.</p>
          </div>
          <div className="need-grid">
            {needCards.map(n => (
              <Link href={n.href} className="need-card animate-in" key={n.title}>
                <div className={`need-card__icon ${n.scene}`}></div>
                <h3>{n.title}</h3>
                <p>{n.desc}</p>
                <span className="need-card__cta">{n.cta}</span>
              </Link>
            ))}
            <Link href="/custom" className="need-card animate-in need-card--featured">
              <div className="need-card__icon scene--cp-roller"><div className="blind-slats"></div></div>
              <h3>CUSTOM PRINTED ART</h3>
              <p>Turn any photo, artwork, or design into a custom window blind. Try the live preview tool.</p>
              <span className="need-card__cta">Try Preview Tool →</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
