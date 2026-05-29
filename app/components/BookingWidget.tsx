'use client';

import { useMemo, useState } from 'react';
import { destinations } from '@/lib/destinations';

type AddOn = {
  id: string;
  label: string;
  price: number;
  description: string;
};

const addOns: AddOn[] = [
  { id: 'yacht', label: 'Private yacht charter', price: 1250, description: 'Half-day curated sea escape' },
  { id: 'culture', label: 'Cultural immersion', price: 680, description: 'Local expert + private access' },
  { id: 'dining', label: 'Michelin dining', price: 540, description: 'Chef-led tasting reservation' },
  { id: 'arrival', label: 'VIP airport arrival', price: 310, description: 'Fast-track, lounge, private transfer' }
];

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function toIso(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseIso(value: string) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date: Date, days: number) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + days);
  return clone;
}

function nightsBetween(start: string | null, end: string | null) {
  if (!start || !end) return 0;
  const ms = parseIso(end).getTime() - parseIso(start).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function createCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const firstDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ label: string; iso: string | null; disabled?: boolean }> = [];

  for (let i = 0; i < firstDay; i += 1) cells.push({ label: '', iso: null, disabled: true });
  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = toIso(new Date(year, month, day));
    cells.push({ label: String(day), iso });
  }
  while (cells.length % 7 !== 0) cells.push({ label: '', iso: null, disabled: true });
  return cells;
}

export default function BookingWidget() {
  const firstDestination = destinations[0];
  const [destinationId, setDestinationId] = useState(firstDestination.id);
  const [visibleMonth, setVisibleMonth] = useState(new Date(2026, 11, 1));
  const [startDate, setStartDate] = useState<string | null>('2026-12-10');
  const [endDate, setEndDate] = useState<string | null>('2026-12-17');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(['culture', 'arrival']);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [preferences, setPreferences] = useState('Anniversary trip, ocean-view suite, private airport transfer.');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const destination = destinations.find((item) => item.id === destinationId) ?? firstDestination;
  const days = useMemo(
    () => createCalendarDays(visibleMonth.getFullYear(), visibleMonth.getMonth()),
    [visibleMonth]
  );

  const nights = nightsBetween(startDate, endDate) || 1;
  const selectedAddOnTotal = addOns
    .filter((item) => selectedAddOns.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const guestMultiplier = 1 + Math.max(guests - 2, 0) * 0.18;
  const roomMultiplier = rooms > 1 ? 1 + (rooms - 1) * 0.72 : 1;
  const seasonalMultiplier = startDate?.startsWith('2026-12') ? 1.18 : 1;
  const accommodation = destination.baseNightly * nights * guestMultiplier * roomMultiplier * seasonalMultiplier;
  const travelerFee = guests * 135;
  const taxes = (accommodation + selectedAddOnTotal + travelerFee) * 0.12;
  const total = Math.round(accommodation + selectedAddOnTotal + travelerFee + taxes);

  function selectDate(iso: string | null) {
    if (!iso) return;
    if (!startDate || (startDate && endDate)) {
      setStartDate(iso);
      setEndDate(null);
      return;
    }

    if (parseIso(iso) <= parseIso(startDate)) {
      setStartDate(iso);
      setEndDate(null);
      return;
    }

    setEndDate(iso);
  }

  function isInRange(iso: string | null) {
    if (!iso || !startDate || !endDate) return false;
    return parseIso(iso) > parseIso(startDate) && parseIso(iso) < parseIso(endDate);
  }

  function isSelected(iso: string | null) {
    return Boolean(iso && (iso === startDate || iso === endDate));
  }

  function toggleAddOn(id: string) {
    setSelectedAddOns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  }

  async function submitBooking() {
    if (!customerName.trim() || !customerEmail.trim()) {
      setStatus('error');
      setMessage('Please add your name and email so the concierge team can contact you.');
      return;
    }

    setStatus('sending');
    setMessage('');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId,
          startDate,
          endDate: endDate ?? toIso(addDays(parseIso(startDate ?? toIso(new Date())), nights)),
          guests,
          rooms,
          addOns: selectedAddOns,
          quote: total,
          customerName,
          customerEmail,
          customerPhone,
          preferences
        })
      });

      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error ?? 'Booking request failed');

      setStatus('sent');
      setMessage('Your concierge request has been saved. A travel advisor will review the details next.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <aside className="booking-card" aria-label="Create your trip">
      <div className="booking-card__shine" />
      <div className="booking-card__header">
        <span className="eyebrow">Tailored quote</span>
        <h3>Create Your Trip</h3>
        <p>Select a destination, dates, guests, and curated upgrades.</p>
      </div>

      <div className="client-fields">
        <label>
          <span>Full name</span>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Amelia Stone" />
        </label>
        <label>
          <span>Email address</span>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="amelia@example.com"
          />
        </label>
        <label>
          <span>Phone / WhatsApp</span>
          <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+234 800 000 0000" />
        </label>
      </div>

      <label className="field-label" htmlFor="destination">
        Select destination
      </label>
      <select id="destination" value={destinationId} onChange={(e) => setDestinationId(e.target.value)}>
        {destinations.map((item) => (
          <option key={item.id} value={item.id}>
            {item.title} · {item.location}
          </option>
        ))}
      </select>

      <div className="destination-intel" aria-label="Destination intelligence">
        <div>
          <span>Best time</span>
          <strong>{destination.bestTime}</strong>
        </div>
        <div>
          <span>Gateway</span>
          <strong>{destination.flightGateway}</strong>
        </div>
      </div>

      <div className="calendar">
        <div className="calendar__topline">
          <strong>
            {monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
          </strong>
          <div className="calendar__actions">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}
            >
              ›
            </button>
          </div>
        </div>
        <div className="calendar__weekdays" aria-hidden="true">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="calendar__grid">
          {days.map((day, index) => (
            <button
              key={`${day.iso ?? 'empty'}-${index}`}
              type="button"
              disabled={!day.iso}
              className={`${isSelected(day.iso) ? 'is-selected' : ''} ${isInRange(day.iso) ? 'is-range' : ''}`}
              onClick={() => selectDate(day.iso)}
              aria-label={day.iso ? `Select ${day.iso}` : 'Empty calendar day'}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      <div className="booking-meta">
        <label>
          <span>Guests</span>
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6].map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Rooms</span>
          <select value={rooms} onChange={(e) => setRooms(Number(e.target.value))}>
            {[1, 2, 3].map((value) => (
              <option key={value} value={value}>
                {value} {value === 1 ? 'Suite' : 'Suites'}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="preferences-field">
        <span>Concierge notes</span>
        <textarea value={preferences} onChange={(e) => setPreferences(e.target.value)} rows={3} />
      </label>

      <div className="addons" aria-label="Premium upgrades">
        {addOns.map((item) => (
          <button
            type="button"
            key={item.id}
            className={selectedAddOns.includes(item.id) ? 'is-active' : ''}
            onClick={() => toggleAddOn(item.id)}
          >
            <span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </span>
            <em>{currency(item.price)}</em>
          </button>
        ))}
      </div>

      <div className="price-box">
        <div>
          <span>Accommodation</span>
          <strong>{currency(accommodation)}</strong>
        </div>
        <div>
          <span>Experiences</span>
          <strong>{currency(selectedAddOnTotal)}</strong>
        </div>
        <div>
          <span>Traveler fee</span>
          <strong>{currency(travelerFee)}</strong>
        </div>
        <div>
          <span>Taxes</span>
          <strong>{currency(taxes)}</strong>
        </div>
        <div className="price-box__total">
          <span>Total</span>
          <strong>{currency(total)}</strong>
        </div>
      </div>

      <button className="confirm-button" type="button" onClick={submitBooking} disabled={status === 'sending'}>
        {status === 'sending' ? 'Saving concierge request…' : status === 'sent' ? 'Request Saved ✓' : 'Confirm Booking'}
        <span>→</span>
      </button>

      {message ? <p className={`form-message form-message--${status}`}>{message}</p> : null}

      <p className="booking-note">
        {nights} night{nights === 1 ? '' : 's'} · from {currency(destination.baseNightly)}/night · {destination.rating} guest rating
      </p>
    </aside>
  );
}
