import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { destinations } from '@/lib/destinations';

type BookingPayload = {
  destinationId?: string;
  startDate?: string;
  endDate?: string;
  guests?: number;
  rooms?: number;
  addOns?: string[];
  quote?: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  preferences?: string;
};

function validDate(value?: string) {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as BookingPayload;
  const destination = destinations.find((item) => item.id === payload.destinationId);

  if (!destination || !validDate(payload.startDate) || !validDate(payload.endDate)) {
    return NextResponse.json(
      { ok: false, error: 'Please provide a valid destination and date range.' },
      { status: 400 }
    );
  }

  if (!payload.customerName?.trim() || !payload.customerEmail?.trim()) {
    return NextResponse.json(
      { ok: false, error: 'Name and email are required for concierge follow-up.' },
      { status: 400 }
    );
  }

  const booking = {
    destination_id: destination.id,
    destination_title: destination.title,
    start_date: payload.startDate,
    end_date: payload.endDate,
    guests: Math.max(1, Number(payload.guests ?? 1)),
    rooms: Math.max(1, Number(payload.rooms ?? 1)),
    add_ons: payload.addOns ?? [],
    quote_usd: Math.max(0, Number(payload.quote ?? 0)),
    customer_name: payload.customerName.trim(),
    customer_email: payload.customerEmail.trim().toLowerCase(),
    customer_phone: payload.customerPhone?.trim() ?? '',
    preferences: payload.preferences?.trim() ?? '',
    status: 'concierge_review',
    source: 'website',
    created_at: new Date().toISOString()
  };

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: 'Booking storage is not configured yet.' },
      { status: 503 }
    );
  }

  const { data, error } = await supabase.from('bookings').insert(booking).select('id').single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, bookingId: data?.id });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key') ?? request.headers.get('x-admin-key');

  if (!process.env.ADMIN_ACCESS_KEY || key !== process.env.ADMIN_ACCESS_KEY) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'Booking storage is not configured yet.' }, { status: 503 });
  }

  const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(50);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, bookings: data });
}
