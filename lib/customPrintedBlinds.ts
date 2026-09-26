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
    images: ['photo-1.jpg', 'photo-2.jpg', 'photo-3.jpg', 'photo-4.jpg', 'photo-5.jpg', 'photo-6.jpg'],
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
    images: ['landscape-1.jpg', 'landscape-2.jpg', 'landscape-3.jpg', 'landscape-4.jpg', 'landscape-5.jpg', 'landscape-6.jpg', 'landscape-7.jpg'],
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
    images: ['artwork-1.jpg', 'artwork-2.jpg', 'artwork-3.jpg', 'artwork-4.jpg', 'artwork-5.jpg', 'artwork-6.jpg', 'artwork-7.jpg'],
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
    images: ['kids-1.jpg', 'kids-2.jpg', 'kids-3.jpg', 'kids-4.jpg', 'kids-5.jpg', 'kids-6.jpg'],
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
