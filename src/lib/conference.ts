export const registrationUrl = 'https://forms.gle/9G9bd8FyDzxz4YTr9';
export const programmeUrl = 'https://site.ddw.nl/en/programme/18408/hardware-interaction-design-conference';
export const mapUrl = 'https://share.google/HMqrJSUTkAtiunpXP';
export const hardwarePhoto = '/4CEACD57-7583-4AE8-9F82-D40F02471D0C_1_105_c.jpeg';

export const partners = [
  {
    name: 'Hapticlabs', kind: 'Workshop', image: '/hapticlabs.jpg', logo: '/hapticlabs.svg',
    width: 1000, height: 821, logoWidth: 100, logoHeight: 100,
    alt: 'Designing a haptic effect on a laptop with a Hapticlabs kit.',
    url: 'https://www.hapticlabs.io/', invert: true
  },
  {
    name: 'Schematik', kind: 'Demo', image: '/schematik.jpg', logo: '/schematik.svg',
    width: 900, height: 600, logoWidth: 371, logoHeight: 55,
    alt: 'An Arduino board wired to a breadboard, two buttons and a small OLED display reading SCHEMATIK, on a cutting mat.',
    url: 'https://schematik.io/', invert: false
  },
  {
    name: 'Teufel', kind: 'Talk', image: '/teufel.jpg', logo: '/teufel.svg',
    width: 800, height: 663, logoWidth: 235, logoHeight: 88,
    alt: 'A Teufel Bluetooth speaker laid out as separable parts: housing, grille, drivers, circuit board, strap, and screws.',
    url: 'https://teufel.de/', invert: false
  }
] as const;

export const pillars = [
  { title: 'Talks', icon: '⚡', text: 'Scheduled, practical talks and case studies from professionals working on real hardware products.' },
  { title: 'Workshops', icon: '⇄', text: 'Scheduled, hands-on sessions on specific tools and methods — part of the planned programme.' },
  { title: 'Interactive Sessions', icon: '◎', text: 'Open, unstructured time to bring your own tool, product, or method and let other attendees try it.' }
];

export const topics = [
  'User research for physical products', 'Hardware prototyping', 'Haptics & force feedback',
  'Buttons, knobs & physical controls', 'Embedded interfaces', 'Industrial design & interaction design',
  'Product testing & validation', 'Sensors & input systems', 'Light guides & optical design',
  'Accessibility in hardware', 'Manufacturing constraints', 'Design systems for physical products',
  'Service & repair experiences', 'Consumer electronics', 'Automotive', 'Medical devices',
  'Industrial equipment', 'Maker products'
];
