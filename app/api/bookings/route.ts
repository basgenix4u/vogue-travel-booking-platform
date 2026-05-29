import { NextResponse } from 'next/server';
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

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  return { url: url.replace(/\/$/, ''), serviceRoleKey };
}

async function supabaseRequest(path: string, init: RequestInit = {}) {
  const config = getSupabaseConfig();
  if (!config) throw new Error('Booking storage is not configured yet.');

  return fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {})
    },
    cache: 'no-store'
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

  try {
    const response = await supabaseRequest('bookings?select=id', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(booking)
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data?.message ?? 'Unable to save booking request.' },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true, bookingId: data?.[0]?.id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unable to save booking request.' },
      { status: 503 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key') ?? request.headers.get('x-admin-key');

  if (!process.env.ADMIN_ACCESS_KEY || key !== process.env.ADMIN_ACCESS_KEY) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await supabaseRequest('bookings?select=*&order=created_at.desc&limit=50');
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data?.message ?? 'Unable to load bookings.' },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true, bookings: data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unable to load bookings.' },
      { status: 503 }
    );
  }
}
