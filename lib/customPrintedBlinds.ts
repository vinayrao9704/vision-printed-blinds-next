export interface CustomPrintCategory {
  id: string;
  index: string;
  label: string;
  heading: string;
  description: string;
  features: string[];
  images: string[];
  imageLayout: 'left' | 'right';
}

export const customPrintCategories: CustomPrintCategory[] = [
  {
    id: 'photo',
    index: '01 / PHOTO PRINTED',
    label: 'Photo Printed Blinds',
    heading: 'Turn Your Favourite Photo Into a Window',
    description:
      'Family photos, pets, travel memories, or a single special moment, printed edge to edge on premium blind fabric. Every blind is made to fit your exact window, so your photo becomes a permanent part of the room.',
    features: [
      'Any personal photo you send us',
      'High-resolution, full-colour printing',
      'Fade-resistant inks that hold their colour for years',
      'Perfect for bedrooms and living rooms',
    ],
    images: ['photo-1.webp', 'photo-2.webp', 'photo-3.webp', 'photo-5.webp', 'photo-6.webp'],
    imageLayout: 'left',
  },
  {
    id: 'landscape',
    index: '02 / LANDSCAPE PRINTED',
    label: 'Landscape Printed Blinds',
    heading: 'Bring the Outdoors Into Every Room',
    description:
      'Mountains, forests, beaches, city skylines, and sunsets, printed as panoramic scenes across your blinds. A landscape print can make a small room feel bigger and turn a plain view into something worth looking at.',
    features: [
      'Wide, panoramic nature and city scenes',
      'Makes rooms feel larger and brighter',
      'Great for offices and windows with a poor view',
      'A calming, high-impact focal point',
    ],
    images: ['landscape-1.webp', 'landscape-2.webp', 'landscape-3.webp', 'landscape-4.webp', 'landscape-5.webp', 'landscape-6.webp', 'landscape-7.webp'],
    imageLayout: 'right',
  },
  {
    id: 'artwork',
    index: '03 / ARTWORK & PATTERNS',
    label: 'Artwork & Patterns',
    heading: 'Designer Style, Printed to Match Your Space',
    description:
      'Abstract art, geometric shapes, and modern patterns printed to match your existing décor. Whether your style is bold and contemporary or soft and classic, we can adjust the colours to fit the room exactly.',
    features: [
      'Matched to your décor colours',
      'Modern, abstract, and classic pattern styles',
      'Custom colour adjustments on request',
      'A designer finish without designer pricing',
    ],
    images: ['artwork-1.webp', 'artwork-2.webp', 'artwork-3.webp', 'artwork-4.webp', 'artwork-5.webp', 'artwork-6.webp', 'artwork-7.webp'],
    imageLayout: 'left',
  },
  {
    id: 'kids',
    label: 'Kids Designs',
    index: '04 / KIDS DESIGNS',
    heading: 'Fun, Colourful Blinds for Kids\' Rooms',
    description:
      'Animals, space scenes, playful illustrations, alphabets, or your child\'s own name, printed onto blinds built for a nursery or kids\' room. Bright and playful on the outside, with the same blackout options as any other blind.',
    features: [
      'Bright, playful colours and characters',
      'Personalised with your child\'s name',
      'Blackout options for better sleep',
      'Safe, cordless operation available',
    ],
    images: ['kids-1.webp', 'kids-2.webp', 'kids-3.webp', 'kids-4.webp', 'kids-5.webp', 'kids-6.webp', 'kids-7.webp'],
    imageLayout: 'right',
  },
  {
    id: 'business',
    index: '05 / BUSINESS BRANDING',
    label: 'Business Branding',
    heading: 'Turn Your Storefront Into Advertising',
    description:
      'Your logo, brand colours, or promotional graphics, printed onto blinds for storefronts, offices, clinics, salons, and restaurants. A branded window does double duty: it controls light and privacy while working as a sign for everyone who walks by.',
    features: [
      'Logo and brand colour printing',
      'Turns every window into advertising',
      'A polished, professional look for reception areas',
      'Consistent branding across every location',
    ],
    images: ['business-1.jpg', 'business-2.jpg', 'business-3.jpg', 'business-4.jpg', 'business-5.jpg', 'business-6.jpg'],
    imageLayout: 'left',
  },
];
