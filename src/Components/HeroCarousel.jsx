import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const TMDB_IMG   = 'https://image.tmdb.org/t/p/original';
const SLIDE_DURATION = 10000; // 10 s per slide

export const HeroCarousel = ({ movies = [] }) => {
  const [current, setCurrent]     = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying] = useState(true);  // auto-advance
  const [isMuted, setIsMuted]     = useState(true);
  const timerRef  = useRef(null);

  const key = import.meta.env.VITE_API_KEY;

  const featured = movies.slice(0, 8);
  const movie    = featured[current];

  /* ── fetch YouTube trailer for the active movie ── */
  useEffect(() => {
    if (!movie?.id) return;
    setTrailerKey(null);
    setShowVideo(false);

    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${key}`)
      .then(r => r.json())
      .then(data => {
        const trailer =
          data.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
          data.results?.find(v => v.site === 'YouTube' && v.type === 'Teaser')  ||
          data.results?.find(v => v.site === 'YouTube');
        if (trailer) {
          setTrailerKey(trailer.key);
          // small delay so backdrop is visible first
          setTimeout(() => setShowVideo(true), 1800);
        }
      })
      .catch(() => {});
  }, [movie?.id, key]);

  /* ── auto-advance timer ── */
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrent(c => (c + 1) % featured.length);
      }, SLIDE_DURATION);
    }
  }, [featured.length, isPlaying]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer, current]);

  const goTo = (idx) => {
    setCurrent(idx);
    resetTimer();
  };
  const prev = () => goTo((current - 1 + featured.length) % featured.length);
  const next = () => goTo((current + 1) % featured.length);

  if (!movie) return null;

  const backdrop = movie.backdrop_path ? `${TMDB_IMG}${movie.backdrop_path}` : null;
  const year     = movie.release_date  ? movie.release_date.slice(0, 4) : '';

  /* YouTube embed URL – muted, autoplaying, looping, no controls */
  let ytSrc = null;
  if (trailerKey) {
    const muteParam = isMuted ? 1 : 0;
    ytSrc = `https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=${muteParam}&loop=1&playlist=${trailerKey}&controls=0&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`;
  }

  let overviewText = 'No overview available.';
  if (movie.overview) {
    overviewText = movie.overview.length > 200 ? movie.overview.slice(0, 200) + '…' : movie.overview;
  }

  return (
    <div className="hero-carousel">

      {/* ── BACKGROUND ── */}
      <div className="hero-carousel__bg">
        {/* Backdrop image (always rendered as fallback / before video loads) */}
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className={`hero-carousel__img${showVideo ? ' hero-carousel__img--hidden' : ''}`}
          />
        )}

        {/* YouTube iframe */}
        {showVideo && ytSrc && (
          <div className="hero-carousel__video-wrapper">
            <iframe
              src={ytSrc}
              className="hero-carousel__iframe"
              title="Movie trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              frameBorder="0"
            />
          </div>
        )}

        {/* gradient overlays */}
        <div className="hero-carousel__overlay" />
      </div>

      {/* ── CONTENT ── */}
      <div className="hero-carousel__content">
        <div className="hero-carousel__strip d-flex align-items-center gap-3 mb-3">
          <span className="hero-strip-badge border px-2 py-1 rounded-1 fw-bold" style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.4)', color: '#fff' }}>U/A 13+</span>
          {year && <span className="hero-strip-year fw-semibold text-light">{year}</span>}
          <span className="hero-strip-runtime fw-semibold text-light">2h 15m</span>
          <span className="hero-strip-hd border border-secondary px-1 rounded text-light" style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.4)' }}>HD</span>
        </div>

        <h1 className="hero-carousel__title">
          {movie.title || 'Untitled'}
        </h1>

        <p className="hero-carousel__overview">
          {overviewText}
        </p>

        <div className="hero-carousel__actions">
          {trailerKey ? (
            <a
              href={`https://www.youtube.com/watch?v=${trailerKey}`}
              target="_blank"
              rel="noreferrer"
              className="hero-btn hero-btn--primary"
            >
              <i className="bi bi-play-fill"></i> Watch Trailer
            </a>
          ) : null}
          <Link to={`/movie/${movie.id}`} className="hero-btn hero-btn--secondary">
            <i className="bi bi-info-circle-fill"></i> More Info
          </Link>
        </div>
      </div>

      {/* ── PREV / NEXT arrows ── */}
      <button className="hero-carousel__arrow hero-carousel__arrow--left" onClick={prev} aria-label="Previous">
        <i className="bi bi-chevron-left"></i>
      </button>
      <button className="hero-carousel__arrow hero-carousel__arrow--right" onClick={next} aria-label="Next">
        <i className="bi bi-chevron-right"></i>
      </button>

      {/* ── MUTE TOGGLE ── */}
      {showVideo && trailerKey && (
        <button 
          className="hero-mute-btn d-flex align-items-center justify-content-center rounded-circle border border-secondary position-absolute" 
          style={{ bottom: '20%', right: '5%', width: '45px', height: '45px', zIndex: 20, backdropFilter: 'blur(4px)', background: 'rgba(10,10,15,0.4)', color: 'white', cursor: 'pointer' }}
          onClick={() => setIsMuted(!isMuted)}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <i className={`bi bi-${isMuted ? 'volume-mute-fill' : 'volume-up-fill'} fs-5`}></i>
        </button>
      )}

      {/* ── DOT INDICATORS ── */}
      <div className="hero-carousel__dots">
        {featured.map((f, i) => (
          <button
            key={f.id || i}
            className={`hero-carousel__dot${i === current ? ' hero-carousel__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── PROGRESS BAR ── */}
      <div className="hero-carousel__progress">
        <div
          key={current}
          className="hero-carousel__progress-bar"
          style={{ animationDuration: `${SLIDE_DURATION}ms` }}
        />
      </div>
    </div>
  );
};
