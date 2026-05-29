import BookingWidget from './components/BookingWidget';
import { conciergeTimeline, destinations, perks } from '@/lib/destinations';

const experiences = [
  {
    title: 'Private Yacht Charters',
    copy: 'Explore hidden coves and pristine waters aboard your personal luxury vessel.',
    icon: '◌'
  },
  {
    title: 'Cultural Immersion',
    copy: 'Connect with local traditions through exclusive workshops and ceremonies.',
    icon: '◎'
  },
  {
    title: 'Gourmet Adventures',
    copy: 'Savor Michelin-starred cuisine and private chef experiences.',
    icon: '◇'
  }
];

const stats = [
  ['48h', 'itinerary design'],
  ['120+', 'curated escapes'],
  ['24/7', 'concierge care']
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <div className="hero__bg" />
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label="VogueTravel home">
            <span className="brand__mark">✦</span>
            <span>VogueTravel</span>
          </a>
          <div className="nav__links">
            <a href="#destinations">Destinations</a>
            <a href="#experiences">Experiences</a>
            <a href="#process">Process</a>
            <a href="#booking">Book</a>
            <a href="#contact">Contact</a>
          </div>
          <a className="nav__cta" href="#booking">
            Contact Us
          </a>
        </nav>

        <div className="hero__content">
          <p className="section-kicker">Luxury Travel Redefined</p>
          <h1>
            Discover Your
            <em> Perfect Escape</em>
          </h1>
          <p>
            Curated journeys to the world's most extraordinary destinations. Where luxury meets authentic exploration.
          </p>

          <form className="search-pill" aria-label="Trip search form">
            <label>
              <span>Where to?</span>
              <strong>Santorini</strong>
            </label>
            <label>
              <span>When?</span>
              <strong>Add dates</strong>
            </label>
            <label>
              <span>Travelers</span>
              <strong>2 Guests</strong>
            </label>
            <a href="#booking" aria-label="Start booking">
              ↗
            </a>
          </form>
        </div>

        <div className="hero__stats" aria-label="VogueTravel performance highlights">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section destinations" id="destinations">
        <div className="section__heading">
          <p className="section-kicker">Curated Destinations</p>
          <h2>Extraordinary Places</h2>
          <p>Handpicked locations that redefine the meaning of luxury travel.</p>
        </div>

        <div className="destination-grid">
          {destinations.map((destination) => (
            <article key={destination.id} className={`destination-card destination-card--${destination.size}`}>
              <img src={destination.image} alt={`${destination.title}, ${destination.location}`} />
              <div className="destination-card__overlay" />
              <div className="destination-card__content">
                <span>★ {destination.rating}</span>
                <h3>{destination.title}</h3>
                <p>{destination.blurb}</p>
                <small>⌖ {destination.location}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section insight-section" aria-label="Destination intelligence">
        <div className="section__heading">
          <p className="section-kicker">Travel Intelligence</p>
          <h2>Expert-Led Planning</h2>
          <p>Every itinerary combines timing, flight access, climate and signature experiences.</p>
        </div>
        <div className="insight-grid">
          {destinations.map((destination) => (
            <article key={destination.id} className="insight-card">
              <h3>{destination.title}</h3>
              <dl>
                <div>
                  <dt>Best time</dt>
                  <dd>{destination.bestTime}</dd>
                </div>
                <div>
                  <dt>Gateway</dt>
                  <dd>{destination.flightGateway}</dd>
                </div>
                <div>
                  <dt>Climate</dt>
                  <dd>{destination.climate}</dd>
                </div>
                <div>
                  <dt>Signature</dt>
                  <dd>{destination.signature}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="section experiences" id="experiences">
        <div className="section__heading">
          <p className="section-kicker">Unique Experiences</p>
          <h2>Beyond Ordinary</h2>
          <p>Curated moments that become lifelong memories.</p>
        </div>

        <div className="experience-grid">
          {experiences.map((experience) => (
            <article key={experience.title} className="experience-card">
              <span>{experience.icon}</span>
              <h3>{experience.title}</h3>
              <p>{experience.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section process-section" id="process">
        <div className="section__heading">
          <p className="section-kicker">Concierge Workflow</p>
          <h2>From Dream to Departure</h2>
          <p>A professional booking workflow built for real luxury travel teams.</p>
        </div>
        <div className="timeline-grid">
          {conciergeTimeline.map((item) => (
            <article key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="booking-section" id="booking">
        <div className="booking-copy">
          <p className="section-kicker">Bespoke Booking</p>
          <h2>Book Your Dream Journey</h2>
          <p>
            Experience seamless booking with an intuitive quote engine and concierge request workflow. Every detail is crafted for comfort, trust, and premium travel operations.
          </p>
          <ul>
            {perks.map((perk) => (
              <li key={perk}>✓ {perk}</li>
            ))}
          </ul>
        </div>
        <BookingWidget />
      </section>

      <section className="section testimonial-section" aria-label="Client feedback">
        <div className="testimonial-card">
          <p>
            “The platform turned a complex multi-destination luxury itinerary into a smooth booking experience. The live quote made upgrades transparent and easy.”
          </p>
          <div>
            <strong>Amelia Stone</strong>
            <span>Private Client Advisor</span>
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div>
          <a className="brand" href="#home">
            <span className="brand__mark">✦</span>
            <span>VogueTravel</span>
          </a>
          <p>Crafting extraordinary journeys for discerning travelers since 2018.</p>
        </div>
        <div className="footer__columns">
          <div>
            <h4>Destinations</h4>
            <a href="#destinations">Europe</a>
            <a href="#destinations">Asia Pacific</a>
            <a href="#destinations">Middle East</a>
            <a href="#destinations">Americas</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#experiences">About Us</a>
            <a href="#booking">Careers</a>
            <a href="#booking">Press</a>
            <a href="#booking">Partners</a>
          </div>
          <div>
            <h4>Support</h4>
            <a href="mailto:hello@voguetravel.example">Help Center</a>
            <a href="mailto:hello@voguetravel.example">Contact Us</a>
            <a href="/admin">Admin Desk</a>
            <a href="#booking">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
