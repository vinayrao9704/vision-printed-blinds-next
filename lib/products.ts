export interface Product {
  id: string;
  category: string[];
  name: string;
  scene: string;
  /** Real product photo, e.g. `/images/products/cp-roller.jpg`. Falls back to
   *  the CSS `scene` illustration when unset. */
  image?: string;
  badge: string;
  tags: string[];
  desc: string;
}

export const products: Product[] = [
  { id: 'cp-roller',     category: ['custom','roller'],        name: 'Custom Printed Roller Blinds',    scene: 'scene--cp-roller',       badge: '★ OUR SPECIALTY', tags: ['custom-print','blackout','motorized','custom-size'], desc: 'Your image, your design on a clean modern roller blind. Our most popular custom product.' },
  { id: 'cp-blackout',   category: ['custom','blackout'],      name: 'Custom Printed Blackout Blinds',  scene: 'scene--cp-blackout',     badge: '',                tags: ['custom-print','blackout','custom-size'], desc: 'Full blackout with your custom image printed on premium light-blocking fabric.' },
  { id: 'cp-solar',      category: ['custom','solar'],         name: 'Custom Printed Solar Shades',     scene: 'scene--cp-solar',        badge: '',                tags: ['custom-print','light-filter','uv','custom-size'], desc: 'UV protection and glare control with your custom imagery.' },
  { id: 'cp-landscape',  category: ['custom'],                 name: 'Landscape & Nature Blinds',       scene: 'scene--cp-landscape',    badge: 'POPULAR',         tags: ['custom-print','residential','custom-size'], desc: 'Canadian Rockies, mountain lakes, beaches, forests on your windows.' },
  { id: 'cp-photo',      category: ['custom'],                 name: 'Custom Photo Blinds',             scene: 'scene--cp-photo',        badge: '',                tags: ['custom-print','residential','custom-size'], desc: 'Family photos, travel memories, and special moments as window art.' },
  { id: 'cp-business',   category: ['custom','commercial'],    name: 'Business & Branding Blinds',      scene: 'scene--cp-business',     badge: 'B2B',             tags: ['custom-print','commercial','custom-size'], desc: 'Company logos, brand colors, promotional graphics for your windows.' },
  { id: 'cp-kids',       category: ['custom'],                 name: 'Kids & Nursery Printed Blinds',   scene: 'scene--cp-kids',         badge: '',                tags: ['custom-print','blackout','residential','custom-size'], desc: "Playful characters, space themes, animals for children's rooms." },
  { id: 'cp-art',        category: ['custom'],                 name: 'Art & Pattern Blinds',            scene: 'scene--cp-art',          badge: '',                tags: ['custom-print','residential','custom-size'], desc: 'Abstract art, geometric patterns, textures, and illustrations.' },
  { id: 'roller-light',  category: ['roller'],                 name: 'Light Filtering Roller Blinds',   scene: 'scene--roller-light',    badge: '',                tags: ['light-filter','residential','custom-size'], desc: 'Soft diffused natural light with clean modern styling.' },
  { id: 'roller-blkout', category: ['roller','blackout'],      name: 'Blackout Roller Blinds',          scene: 'scene--roller-blackout', badge: '',                tags: ['blackout','residential','custom-size'], desc: 'Complete light blockage for bedrooms, nurseries and media rooms.' },
  { id: 'roller-comm',   category: ['roller','commercial'],    name: 'Commercial Roller Blinds',        scene: 'scene--roller-commercial',badge: '',               tags: ['commercial','custom-size','blackout'], desc: 'Durable, professional roller blinds for commercial spaces.' },
  { id: 'roller-deco',   category: ['roller'],                 name: 'Decorative Roller Blinds',        scene: 'scene--roller-deco',     badge: '',                tags: ['residential','custom-size','light-filter'], desc: 'Stylish designs to complement your interior decor.' },
  { id: 'zebra-plain',   category: ['zebra'],                  name: 'Zebra Blinds',                    scene: 'scene--zebra-plain',     image: '/images/products/zebra-plain.png', badge: 'POPULAR',         tags: ['privacy','light-filter','residential','custom-size'], desc: 'Alternating sheer and opaque bands for elegant light control.' },
  { id: 'zebra-custom',  category: ['zebra','custom'],         name: 'Custom Design Zebra Blinds',      scene: 'scene--zebra-custom',    badge: '',                tags: ['custom-print','privacy','residential','custom-size'], desc: 'Zebra blinds with your custom design in the opaque bands.' },
  { id: 'zebra-motor',   category: ['zebra','motorized'],      name: 'Motorized Zebra Blinds',          scene: 'scene--zebra-motorized', badge: '',                tags: ['motorized','smart-home','privacy','residential'], desc: 'Smart home compatible zebra blinds with effortless motorized control.' },
  { id: 'blkout-bdrm',   category: ['blackout'],               name: 'Bedroom Blackout Blinds',         scene: 'scene--blackout-bedroom',badge: '',                tags: ['blackout','residential','custom-size'], desc: 'Premium blackout for the perfect sleep environment.' },
  { id: 'blkout-nrsy',   category: ['blackout'],               name: 'Nursery Blackout Blinds',         scene: 'scene--blackout-nursery',badge: '',                tags: ['blackout','residential','custom-size'], desc: "Safe, comfortable darkness for baby's best sleep." },
  { id: 'blkout-media',  category: ['blackout'],               name: 'Media Room Blackout Blinds',      scene: 'scene--blackout-media',  badge: '',                tags: ['blackout','residential','custom-size'], desc: 'Create the perfect dark environment for your home theater.' },
  { id: 'solar-res',     category: ['solar'],                  name: 'Solar Shades',                    scene: 'scene--solar-residential',badge: '',               tags: ['light-filter','uv','residential','custom-size'], desc: 'Reduce glare and UV while maintaining your outdoor view.' },
  { id: 'solar-comm',    category: ['solar','commercial'],     name: 'Commercial Solar Shades',         scene: 'scene--solar-commercial',badge: '',                tags: ['commercial','light-filter','uv'], desc: 'Energy-efficient glare control for commercial spaces.' },
  { id: 'motor-roller',  category: ['motorized','roller'],     name: 'Motorized Roller Blinds',         scene: 'scene--motorized-roller',badge: '',                tags: ['motorized','smart-home','residential'], desc: 'Premium roller blinds with motorized operation and smart home integration.' },
  { id: 'motor-smart',   category: ['motorized'],              name: 'Smart Home Blinds',               scene: 'scene--motorized-smart', badge: 'SMART HOME',      tags: ['motorized','smart-home','residential'], desc: 'Alexa and Google Home compatible for hands-free window control.' },
  { id: 'cellular',      category: ['specialty'],              name: 'Cellular / Honeycomb Shades',     scene: 'scene--cellular',        badge: '',                tags: ['energy','light-filter','residential','custom-size'], desc: 'Architectural honeycomb construction for energy efficiency.' },
  { id: 'roman',         category: ['specialty'],              name: 'Roman Shades',                    scene: 'scene--roman',           badge: '',                tags: ['residential','light-filter','elegant','custom-size'], desc: 'Soft, elegant fabric shades that fold beautifully when raised.' },
  { id: 'vertical',      category: ['specialty','commercial'], name: 'Vertical Blinds',                 scene: 'scene--vertical',        badge: '',                tags: ['residential','commercial','large-window','custom-size'], desc: 'Ideal for large windows, patio doors and wide openings.' },
  { id: 'panel-track',   category: ['specialty'],              name: 'Panel Track Blinds',              scene: 'scene--panel-track',     badge: '',                tags: ['residential','large-window','modern'], desc: 'Modern panel systems for wide windows and sliding doors.' },
  { id: 'natural',       category: ['specialty'],              name: 'Natural & Woven Shades',          scene: 'scene--natural',         badge: '',                tags: ['residential','light-filter','custom-size'], desc: 'Bamboo, jute, and natural fiber shades for warmth and texture.' },
  { id: 'curtain-sheer',    category: ['curtains'],            name: 'Sheer Curtains',                  scene: 'scene--curtain-sheer',   image: '/images/products/curtain-sheer.jpg',    badge: '',                tags: ['light-filter','elegant','residential','custom-size'], desc: 'Soft, airy fabric that filters natural light while keeping rooms bright and open.' },
  { id: 'curtain-blackout', category: ['curtains','blackout'], name: 'Blackout Curtains',               scene: 'scene--curtain-blackout',image: '/images/products/curtain-blackout.jpg', badge: '',                tags: ['blackout','residential','custom-size'], desc: 'Heavyweight drapery fabric for full light-blocking and better insulation.' },
  { id: 'curtain-pleat',    category: ['curtains'],            name: 'Pinch Pleat Drapes',              scene: 'scene--curtain-pleat',   image: '/images/products/curtain-pleat.jpg',    badge: '',                tags: ['elegant','residential','custom-size'], desc: 'Tailored pleated header for a formal, structured drape — a classic living and dining room look.' },
  { id: 'curtain-grommet',  category: ['curtains'],            name: 'Grommet Curtains',                scene: 'scene--curtain-grommet', image: '/images/products/curtain-grommet.jpg',  badge: '',                tags: ['residential','custom-size'], desc: 'Metal grommet header for smooth, effortless sliding and a clean modern fold.' },
  { id: 'curtain-custom',   category: ['curtains','custom'],   name: 'Custom Printed Curtains',         scene: 'scene--curtain-custom',  badge: '★ OUR SPECIALTY', tags: ['custom-print','residential','custom-size'], desc: 'Your photo or design printed on full-length drapery fabric for a truly one-of-a-kind room.' },
  { id: 'curtain-layered',  category: ['curtains'],            name: 'Layered Curtain & Sheer Combo',   scene: 'scene--curtain-layered', image: '/images/products/curtain-layered.jpg',  badge: '',                tags: ['light-filter','privacy','elegant','residential','custom-size'], desc: 'Sheers paired with a heavier drape for adjustable light, privacy, and a layered designer finish.' },
];

export const tagLabels: Record<string, string> = {
  'custom-print':  'Custom Printed',
  'blackout':      'Blackout',
  'motorized':     'Motorized',
  'smart-home':    'Smart Home',
  'commercial':    'Commercial',
  'residential':   'Residential',
  'large-window':  'Large Windows',
  'privacy':       'Privacy',
  'light-filter':  'Light Filtering',
  'uv':            'UV Protection',
  'energy':        'Energy Efficient',
  'elegant':       'Elegant',
  'modern':        'Modern',
  'custom-size':   'Custom Sizes',
};
