type Booking = {
  id: string;
  destination_title: string;
  start_date: string;
  end_date: string;
  guests: number;
  rooms: number;
  quote_usd: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  preferences: string | null;
  status: string;
  created_at: string;
};

export const dynamic = 'force-dynamic';

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

async function getBookings(key?: string): Promise<{ bookings: Booking[]; error?: string }> {
  if (!process.env.ADMIN_ACCESS_KEY || key !== process.env.ADMIN_ACCESS_KEY) {
    return { bookings: [], error: 'Enter your admin key to view concierge requests.' };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return { bookings: [], error: 'Supabase is not configured.' };

  const response = await fetch(`${url}/rest/v1/bookings?select=*&order=created_at.desc&limit=50`, {
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`
    },
    cache: 'no-store'
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) return { bookings: [], error: data?.message ?? 'Unable to load bookings.' };

  return { bookings: (data ?? []) as Booking[] };
}

export default async function AdminPage({ searchParams }: { searchParams: { key?: string } }) {
  const { bookings, error } = await getBookings(searchParams.key);

  return (
    <main className="admin-shell">
      <section className="admin-hero">
        <a className="brand" href="/">
          <span className="brand__mark">✦</span>
          <span>VogueTravel</span>
        </a>
        <div>
          <p className="section-kicker">Concierge Desk</p>
          <h1>Booking Requests</h1>
          <p>Private admin view for reviewing high-value travel enquiries.</p>
        </div>
      </section>

      {error ? (
        <section className="admin-lock">
          <h2>Admin access required</h2>
          <p>{error}</p>
          <form>
            <input name="key" placeholder="Enter admin key" />
            <button type="submit">Unlock dashboard</button>
          </form>
        </section>
      ) : (
        <section className="admin-grid">
          {bookings.length === 0 ? <p className="empty-state">No bookings yet. Submit a test request from the homepage.</p> : null}
          {bookings.map((booking) => (
            <article key={booking.id} className="admin-card">
              <div className="admin-card__top">
                <div>
                  <span>{booking.status.replaceAll('_', ' ')}</span>
                  <h2>{booking.destination_title}</h2>
                </div>
                <strong>{currency(booking.quote_usd)}</strong>
              </div>
              <dl>
                <div>
                  <dt>Guest</dt>
                  <dd>{booking.customer_name}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{booking.customer_email}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{booking.customer_phone || 'Not provided'}</dd>
                </div>
                <div>
                  <dt>Trip</dt>
                  <dd>
                    {booking.start_date} → {booking.end_date} · {booking.guests} guests · {booking.rooms} rooms
                  </dd>
                </div>
                <div className="wide">
                  <dt>Preferences</dt>
                  <dd>{booking.preferences || 'No notes yet.'}</dd>
                </div>
              </dl>
              <time>{new Date(booking.created_at).toLocaleString()}</time>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
