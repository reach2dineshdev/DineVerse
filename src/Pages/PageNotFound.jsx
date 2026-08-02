import { Link } from 'react-router-dom'

export const PageNotFound = () => {
  return (
    <div
      className="page-transition d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: '78vh', padding: '2rem' }}
    >
      {/* Giant 404 */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(6rem, 20vw, 12rem)',
          fontWeight: 800,
          lineHeight: 1,
          background: 'linear-gradient(135deg, #e50914 0%, #ff6b6b 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          userSelect: 'none',
        }}
      >
        404
      </div>

      <h2
        className="mt-3 mb-3"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'white' }}
      >
        Looks like this reel got lost…
      </h2>

      <p
        className="mb-5"
        style={{ color: 'var(--color-muted)', fontSize: '1.1rem', maxWidth: '420px' }}
      >
        The page you're looking for doesn't exist or has been moved to another dimension.
      </p>

      <Link
        to="/"
        className="btn btn-primary px-5 py-3"
        style={{ borderRadius: '30px', fontSize: '1rem' }}
      >
        <i className="bi bi-house-door-fill me-2"></i>
        Take Me Home
      </Link>
    </div>
  )
}
