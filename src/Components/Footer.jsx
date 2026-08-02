import { Link } from 'react-router-dom';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="container">
        <div className="row gy-5">

          {/* ── Brand & social ── */}
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="text-decoration-none d-inline-block mb-3">
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: '-0.5px',
                }}
              >
                Dine<span style={{ color: 'var(--color-accent)' }}>Verse</span>
              </h3>
            </Link>
            <p style={{ color: 'var(--color-muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>
              Your ultimate destination for discovering great movies, checking reviews,
              and staying updated with the cinematic universe.
            </p>
            <div className="mt-4">
              <button type="button" className="social-icon border-0 bg-transparent" aria-label="Twitter / X">
                <i className="bi bi-twitter-x"></i>
              </button>
              <button type="button" className="social-icon border-0 bg-transparent" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </button>
              <button type="button" className="social-icon border-0 bg-transparent" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </button>
            </div>
          </div>

          {/* ── Explore links ── */}
          <div className="col-lg-4 col-md-3 col-6">
            <h5
              className="mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'white' }}
            >
              Explore
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/"               className="text-decoration-none quick-links">Home</Link></li>
              <li><Link to="/movies/top"      className="text-decoration-none quick-links">Top Rated</Link></li>
              <li><Link to="/movies/popular"  className="text-decoration-none quick-links">Popular</Link></li>
              <li><Link to="/movies/upcoming" className="text-decoration-none quick-links">Upcoming</Link></li>
            </ul>
          </div>

          {/* ── Legal links ── */}
          <div className="col-lg-4 col-md-3 col-6">
            <h5
              className="mb-3"
              style={{ fontFamily: 'var(--font-display)', color: 'white' }}
            >
              Legal
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><button type="button" className="text-decoration-none quick-links border-0 bg-transparent p-0">Privacy Policy</button></li>
              <li><button type="button" className="text-decoration-none quick-links border-0 bg-transparent p-0">Terms & Conditions</button></li>
              <li><button type="button" className="text-decoration-none quick-links border-0 bg-transparent p-0">Cookie Policy</button></li>
            </ul>
          </div>

        </div>

        {/* ── Copyright bar ── */}
        <div
          className="mt-5 pt-4 text-center"
          style={{
            borderTop: '1px solid var(--color-border)',
            color: 'var(--color-muted)',
            fontSize: '0.85rem',
          }}
        >
          &copy; {year} DineVerse, Inc. All rights reserved. &nbsp;|&nbsp; Movie data provided by{' '}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="quick-links"
          >
            TMDB
          </a>
        </div>
      </div>
    </footer>
  );
};
