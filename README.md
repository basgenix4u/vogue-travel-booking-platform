# VogueTravel — Luxury Booking Platform

A polished portfolio-grade luxury travel booking platform built with **Next.js**, **TypeScript**, **Supabase**, and **Vercel**.


## Live Demo

- Production: https://vogue-travel-booking-platform.vercel.app
- Admin desk: `/admin?key=YOUR_ADMIN_KEY`

## Case Study

A luxury travel agency needed a bespoke booking platform with interactive date selection, dynamic pricing calculation, visual destination galleries, and a concierge request workflow. VogueTravel delivers a premium responsive interface, real-time quote engine, travel intelligence cards, Supabase-backed booking storage, and an admin review desk.

## Features

- Interactive date range calendar
- Dynamic trip pricing calculation
- Premium destination galleries
- Destination intelligence: best season, flight gateway, climate and signature experience
- Concierge notes and customer contact capture
- Luxury add-on experiences and VIP arrival options
- Supabase-backed booking API
- Protected admin booking dashboard at `/admin?key=YOUR_ADMIN_KEY`
- Responsive dark luxury UI inspired by high-end travel agencies
- Vercel deployment ready

## Tech Stack

- Next.js App Router
- React + TypeScript
- CSS custom design system
- Supabase database + server-side service role API
- Vercel deployment

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_ACCESS_KEY=your-private-admin-key
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase.schema.sql` in the SQL editor.
3. Add your Supabase URL and service role key to Vercel.
4. Submit a booking from the homepage.
5. Review submissions from `/admin?key=YOUR_ADMIN_KEY`.

## Deployment

Deploy to Vercel as a Next.js project. Add the same environment variables in the Vercel dashboard.
