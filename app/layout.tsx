import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://vogue-travel-booking-platform.vercel.app'),
  title: 'VogueTravel — Luxury Booking Platform',
  description:
    'A bespoke luxury travel booking platform with interactive date selection, dynamic pricing, and visual destination galleries.',
  openGraph: {
    title: 'VogueTravel — Luxury Booking Platform',
    description: 'Curated escapes, real-time trip pricing, and boutique destination galleries.',
    images: ['/images/hero-aerial-lagoon.jpg']
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
