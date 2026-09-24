import type { Metadata, Viewport } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import './globals.css';
import '../styles/styles.css';
import '../styles/page.css';
import '../styles/blind-designer.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://visionprintedblinds.ca'),
  title: {
    default: 'Custom Printed Blinds Edmonton | Vision Printed Blinds',
    template: '%s | Vision Printed Blinds',
  },
  description: 'Transform your windows with custom printed blinds. Turn photos, artwork, landscapes, patterns and logos into beautiful custom window blinds. Serving Edmonton, Alberta & Canada.',
  keywords: ['custom printed blinds Edmonton', 'printed blinds Edmonton', 'custom blinds Edmonton', 'photo blinds Canada', 'custom photo blinds', 'printed roller blinds'],
  openGraph: {
    type: 'website',
    title: 'Custom Printed Blinds Edmonton | Vision Printed Blinds',
    description: 'Turn your windows into art with custom printed blinds. Serving Edmonton, Alberta & Canada.',
  },
};

// Next.js App Router does not inject a viewport meta tag automatically —
// without this, mobile browsers render at a virtual desktop width (~980px)
// and scale the whole page down to fit, which makes every @media breakpoint
// in the CSS never actually trigger on a real phone/tablet.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ScrollReveal />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
