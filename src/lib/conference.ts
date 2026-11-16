export const registrationUrl = 'https://forms.gle/9G9bd8FyDzxz4YTr9';
export const programmeUrl = 'https://site.ddw.nl/en/programme/18408/hardware-interaction-design-conference';
export const mapUrl = 'https://www.google.com/maps/place/Al+Fresco/@51.4107232,5.4586276,107m/data=!3m1!1e3!4m6!3m5!1s0x47c6d9b8ccb73305:0xb7e7f111912ae67b!8m2!3d51.4107023!4d5.4590172!16s%2Fg%2F11g6xmyz39!5m1!1e3';
export const hardwarePhoto = '/4CEACD57-7583-4AE8-9F82-D40F02471D0C_1_105_c.jpeg';

export const partners = [
  {
    name: 'Hapticlabs', kind: 'Workshop', time: '15:15', image: '/hapticlabs.jpg', logo: '/hapticlabs.svg',
    width: 1000, height: 821, logoWidth: 100, logoHeight: 100,
    alt: 'Designing a haptic effect on a laptop with a Hapticlabs kit.',
    url: 'https://www.hapticlabs.io/', invert: true, lightChip: false, poster: true
  },
  {
    name: 'Schematik', kind: 'Demo', time: '14:00', image: '/schematik.jpg', logo: '/schematik.svg',
    width: 900, height: 600, logoWidth: 371, logoHeight: 55,
    alt: 'An Arduino board wired to a breadboard, two buttons and a small OLED display reading SCHEMATIK, on a cutting mat.',
    url: 'https://schematik.io/', invert: false, lightChip: false, poster: true
  },
  {
    name: 'Teufel', kind: 'Workshop', time: '14:35', image: '/teufel.jpg', logo: '/teufel.svg',
    width: 800, height: 663, logoWidth: 235, logoHeight: 88,
    alt: 'A Teufel Bluetooth speaker laid out as separable parts: housing, grille, drivers, circuit board, strap, and screws.',
    url: 'https://lu.teufelaudio.com/mynd-107002004', invert: false, lightChip: false, poster: true
  },
  {
    name: 'OSHned', kind: 'Talk', time: '14:20', image: '/oshned.jpg', logo: '/oshned-logo.png',
    width: 800, height: 600, logoWidth: 182, logoHeight: 120,
    alt: 'Open-source syringe pumps built from 3D printer parts, beside an OSHNED sign: open-source research hardware, from lab robots to batteries and microscopes.',
    url: 'https://en.makerdays.nl/maker/oshned/', invert: false, lightChip: true, poster: false
  }
] as const;

export const travelUrl = 'https://www.hightechcampus.com/about-us/visit-the-campus/';
export const afterPartyUrl = 'https://waag.org/en/event/open-socials-social-club/';

export const schedule: { start: string; end?: string; title: string; host?: string; text?: string; offsite?: boolean }[] = [
  { start: '12:00', end: '13:00', title: 'Lunch at Al Fresco', text: 'The Italian place behind Student Base. Come early if you want to meet people over food.' },
  { start: '13:30', end: '14:00', title: 'Introduction round' },
  { start: '14:00', end: '14:20', host: 'Schematik', title: 'AI-based tools for embedded coding' },
  { start: '14:20', end: '14:35', host: 'OSHned', title: 'Open-source hardware from Dutch universities, in one national network' },
  { start: '14:35', end: '15:15', host: 'Teufel', title: 'Take an open-source speaker apart and put it back together', text: 'With the UX hardware team at Teufel.' },
  { start: '15:15', end: '16:30', host: 'Hapticlabs', title: 'Hands-on haptic prototyping workshop' },
  { start: '16:30', end: '17:00', title: 'The future of hardware interaction design' },
  { start: '17:00', title: 'Show and tell, and networking', text: 'Bring a tool, product, or method if you have one.' },
  { start: '22:00', title: 'Open Socials Social Club', text: "Optional and off-site: Waag's party at The Basement, Area 51, Ketelhuisplein 18, Strijp. You don't need a Dutch Design Week ticket to get in.", offsite: true }
];

export const topics = [
  'User research for physical products', 'Hardware prototyping', 'Haptics & force feedback',
  'Buttons, knobs & physical controls', 'Embedded interfaces', 'Industrial design & interaction design',
  'Product testing & validation', 'Sensors & input systems', 'Light guides & optical design',
  'Accessibility in hardware', 'Manufacturing constraints', 'Design systems for physical products',
  'Service & repair experiences', 'Consumer electronics', 'Automotive', 'Medical devices',
  'Industrial equipment', 'Maker products'
];

export const eventPath = '/events/eindhoven-2026/';
export const communityUrl = 'https://www.linkedin.com/groups/42710001/';

export const eventPhotos = {
  talk: {
    src: '/events/eindhoven-2026/conference-talk-student-base.jpg',
    alt: 'Attendees listening to a presentation at Student Base, with hardware projects on the tables.',
    caption: 'The first Hardware Interaction Design conference at Student Base during Dutch Design Week.'
  },
  repair: {
    src: '/events/eindhoven-2026/teufel-mynd-speaker-repair.jpg',
    alt: 'Two participants working on an opened Teufel MYND speaker, with repair tools on the table.',
    caption: 'Getting hands-on with the repairable Teufel MYND speaker.'
  },
  workshop: {
    src: '/events/eindhoven-2026/teufel-mynd-workshop.jpg',
    alt: 'A group gathered around a table as a participant uses a screwdriver on an opened speaker.',
    caption: 'Taking the speaker apart together.'
  },
  community: {
    src: '/events/eindhoven-2026/community-projects-and-conversations.jpg',
    alt: 'Participants sharing projects and talking in small groups around the tables at Student Base.',
    caption: 'Projects, questions, and conversations around the tables.'
  }
} as const;

/** Global destinations stay the same on every page. Article shortcuts live in the article. */
export const siteNavigation = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/#events' },
  { label: 'Topics', href: '/#topics' },
  { label: 'Community', href: '/#community' }
] as const;

export const archiveNavigation = [
  { label: 'All past events', href: '/#past-events' },
  { label: 'Eindhoven 2026 recap', href: eventPath }
] as const;
