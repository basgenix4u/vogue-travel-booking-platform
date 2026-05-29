export type Destination = {
  id: string;
  title: string;
  location: string;
  image: string;
  baseNightly: number;
  rating: string;
  blurb: string;
  bestTime: string;
  flightGateway: string;
  climate: string;
  signature: string;
  size: 'large' | 'medium' | 'tall' | 'small';
};

export const destinations: Destination[] = [
  {
    id: 'santorini',
    title: 'Santorini Cliffside',
    location: 'Greece',
    image: '/images/santorini-cliffside.jpg',
    baseNightly: 680,
    rating: '4.98',
    blurb: 'Whitewashed private suites, caldera sunsets, and yacht transfers.',
    bestTime: 'May–October',
    flightGateway: 'Santorini JTR via Athens',
    climate: 'Dry Mediterranean, warm evenings',
    signature: 'Sunset catamaran with private sommelier',
    size: 'large'
  },
  {
    id: 'kyoto',
    title: 'Kyoto Zen Garden',
    location: 'Japan',
    image: '/images/kyoto-zen-garden.jpg',
    baseNightly: 520,
    rating: '4.95',
    blurb: 'Temple-view ryokan stays with tea rituals and garden access.',
    bestTime: 'March–May, Oct–Nov',
    flightGateway: 'Kansai KIX or Osaka ITM',
    climate: 'Mild spring blooms, crisp autumn color',
    signature: 'Private tea master ceremony before opening hours',
    size: 'small'
  },
  {
    id: 'maldives',
    title: 'Maldives Paradise',
    location: 'Maldives',
    image: '/images/maldives-paradise.jpg',
    baseNightly: 890,
    rating: '4.99',
    blurb: 'Overwater villas, reef dining, and seaplane arrival.',
    bestTime: 'November–April',
    flightGateway: 'Malé MLE + seaplane',
    climate: 'Tropical dry season, calm lagoons',
    signature: 'Floating breakfast and reef restoration dive',
    size: 'small'
  },
  {
    id: 'dubai',
    title: 'Dubai Skyline',
    location: 'UAE',
    image: '/images/dubai-skyline.jpg',
    baseNightly: 740,
    rating: '4.93',
    blurb: 'Sky suites, desert dining, and private city experiences.',
    bestTime: 'November–March',
    flightGateway: 'Dubai DXB',
    climate: 'Sunny winter, luxury beach weather',
    signature: 'Helicopter skyline transfer and desert dinner',
    size: 'tall'
  },
  {
    id: 'bali',
    title: 'Bali Rice Terraces',
    location: 'Indonesia',
    image: '/images/bali-rice-terraces.jpg',
    baseNightly: 430,
    rating: '4.94',
    blurb: 'Jungle pool villas, healing rituals, and sunrise terraces.',
    bestTime: 'April–October',
    flightGateway: 'Denpasar DPS',
    climate: 'Dry season, warm tropical evenings',
    signature: 'Ubud wellness ritual and private chef dinner',
    size: 'medium'
  },
  {
    id: 'paris',
    title: 'Parisian Elegance',
    location: 'France',
    image: '/images/parisian-elegance.jpg',
    baseNightly: 610,
    rating: '4.96',
    blurb: 'Left Bank boutique hotels and after-hours museum access.',
    bestTime: 'April–June, Sep–Oct',
    flightGateway: 'Paris CDG or ORY',
    climate: 'Mild city weather, long golden evenings',
    signature: 'After-hours Louvre visit and Seine dining cruise',
    size: 'medium'
  }
];

export const perks = [
  'Best Price Guarantee',
  '24/7 Concierge Service',
  'Free Cancellation Window',
  'Exclusive Member Perks',
  'Visa & Arrival Guidance',
  'Airport Meet-and-Greet'
];

export const conciergeTimeline = [
  {
    step: '01',
    title: 'Discovery Call',
    copy: 'A concierge reviews your travel style, dietary needs, celebration details, and pace preferences.'
  },
  {
    step: '02',
    title: 'Tailored Itinerary',
    copy: 'Within 48 hours you receive a refined itinerary with hotels, transfers, experiences, and optional upgrades.'
  },
  {
    step: '03',
    title: 'Travel Care',
    copy: 'Your trip is monitored end-to-end with destination support for airport arrivals, check-ins, and adjustments.'
  }
];
