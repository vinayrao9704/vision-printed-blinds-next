'use client';

import { useState } from 'react';

const faqs = [
  { q:'What kind of images can I print on my blind?', a:'Almost anything: personal photos, family portraits, landscape photography, artwork, business logos, custom graphics, or any digital image you own the rights to. We recommend images at 150 DPI or higher at print size for best results. Our team will review your file and flag any resolution concerns before printing.' },
  { q:'How do I measure my windows correctly?', a:"When you submit a quote request, we'll send you our step-by-step measurement guide. For inside mounts, measure the exact inside width and height of the window recess. For outside mounts, measure the area you want the blind to cover, adding overlap as needed. If you're unsure, we offer free in-person measuring consultations in the Edmonton area." },
  { q:'How long does production and delivery take?', a:"Custom printed blinds are typically completed within 7–14 business days from order confirmation and file approval. Standard (non-printed) blinds are often faster. Delivery times depend on your location within Canada. We'll give you an estimated completion date when your order is confirmed." },
  { q:'Do you offer motorized or smart home blinds?', a:"Yes. We offer motorized roller blinds compatible with major smart home platforms including Google Home, Amazon Alexa, and Apple HomeKit. Motorization is available on most of our roller blind styles and can be combined with custom printing. Mention this when requesting your quote and we'll include motor options." },
  { q:'Will the print fade over time?', a:'Our UV printing process uses high-quality inks that bond directly to the fabric. Under normal indoor conditions, prints retain vibrant colour for many years. Direct, prolonged exposure to intense sunlight may cause some gradual fading over time. If you have a very sunny window, we can recommend a UV-protective fabric coating. Ask us about this when ordering.' },
  { q:'Can I order blinds for a commercial space or in bulk?', a:"Absolutely. We regularly work with offices, restaurants, retail stores, hotels, and commercial buildings. We handle large quantities, multi-window projects, and branded installations. Contact us directly by phone or email for commercial project inquiries, and we'll provide a custom consultation and project quote." },
  { q:'Do you offer installation?', a:'Our blinds are designed for straightforward DIY installation and come with all hardware and instructions. We also provide installation support resources and can connect you with local installation professionals for larger or more complex projects. For commercial projects, professional installation can be arranged. Mention this in your quote request.' },
  { q:"Why aren't prices listed on the website?", a:"Because every blind we make is custom, the price depends on your exact window dimensions, chosen fabric, whether you want custom printing, motorization, and any other options. A one-size-fits-all price list would be misleading. Instead, we provide a free, no-obligation quote tailored to your specific order. It takes us minutes to put together, and you'll know exactly what you're getting." },
  { q:'What file formats do you accept for custom printing?', a:'We accept JPG, PNG, PDF, TIFF, and SVG (vector) files. For best results, provide the highest-resolution version of your image available. For logos and graphics, a vector file (AI, EPS, SVG) is ideal. If you only have a low-resolution image, contact us. Our design team can sometimes upscale or re-create artwork to a printable quality.' },
  { q:'Do you ship across Canada?', a:"Yes, we ship to all provinces and territories across Canada. While we're based in Edmonton, Alberta, we serve customers nationwide. Shipping costs and timelines will be provided as part of your custom quote. In-person consultations and local pickup are available for Edmonton-area customers." },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {faqs.map((f, i) => (
        <div className={`faq-item${open === i ? ' open' : ''}`} key={f.q}>
          <button
            className="faq-q"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {f.q}
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-a">
            <p>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
