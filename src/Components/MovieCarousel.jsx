import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w780';

export const MovieCarousel = ({ title, movies = [], link /* NOSONAR */ }) => {
  const trackRef    = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd,   setAtEnd]   = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

  const checkEdges = (newPos) => {
    const el = trackRef.current;
    if (!el) return;
    
    const containerWidth = el.parentElement.clientWidth;
    const trackWidth = el.scrollWidth;
    const maxScroll = Math.max(0, trackWidth - containerWidth);
    
    setAtStart(newPos >= 0);
    setAtEnd(newPos <= -maxScroll);
  };

  useEffect(() => {
    setScrollPos(0);
    setAtStart(true);
    setTimeout(() => {
      if (trackRef.current) {
        const el = trackRef.current;
        setAtEnd(el.scrollWidth <= el.parentElement.clientWidth);
      }
    }, 100);
  }, [movies]);

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    
    const containerWidth = el.parentElement.clientWidth;
    const maxScroll = -(Math.max(0, el.scrollWidth - containerWidth));
    const scrollAmount = containerWidth * 0.8;
    
    let newPos = scrollPos + (-dir * scrollAmount);
    
    if (newPos > 0) newPos = 0;
    if (newPos < maxScroll) newPos = maxScroll;
    
    setScrollPos(newPos);
    checkEdges(newPos);
  };

  if (!movies.length) return null;

  return (
    <div className="movie-row mb-5">
      <div className="movie-row__header">
        <h2 className="movie-row__title">{title}</h2>
        {link && (
          <Link to={link} className="movie-row__see-all">
            See All ›
          </Link>
        )}
      </div>

      <div className="movie-row__track-wrapper">
        {/* Left arrow */}
        {!atStart && (
          <button
            className="movie-row__arrow movie-row__arrow--left"
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
        )}

        {/* Scrollable row */}
        <div
          className="movie-row__track"
          ref={trackRef}
          style={{ transform: `translateX(${scrollPos}px)` }}
        >
          {movies.map(movie => {
            const imagePath = movie.backdrop_path || movie.poster_path;
            const poster = imagePath
              ? `${TMDB_IMG}${imagePath}`
              : null;
            const rating = movie.vote_average
              ? Number(movie.vote_average).toFixed(1)
              : 'N/A';

            return (
              <Link
                key={movie.id}
                to={`/${movie.media_type || 'movie'}/${movie.id}`}
                className="movie-row__card"
                title={movie.title}
              >
                <div className="movie-row__card-inner">
                  {poster ? (
                    <img
                      src={poster}
                      alt={movie.title}
                      className="movie-row__poster"
                      loading="lazy"
                    />
                  ) : (
                    <div className="movie-row__no-poster">
                      <i className="bi bi-film" style={{ fontSize: '2rem' }}></i>
                    </div>
                  )}

                  {/* Hover panel */}
                  <div className="movie-row__panel">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <div className="movie-row__panel-btn movie-row__panel-btn--primary">
                        <i className="bi bi-play-fill fs-5" style={{ marginLeft: '2px' }}></i>
                      </div>
                      <div className="movie-row__panel-btn">
                        <i className="bi bi-plus fs-4"></i>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="text-success fw-bold" style={{ fontSize: '0.75rem' }}>{rating} Rating</span>
                      <span className="border px-1 rounded text-light" style={{ fontSize: '0.6rem' }}>HD</span>
                    </div>
                    <div className="text-light fw-bold" style={{ fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{movie.title}</div>
                    <div className="mt-1" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {movie.overview || 'No overview available.'}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right arrow */}
        {!atEnd && (
          <button
            className="movie-row__arrow movie-row__arrow--right"
            onClick={() => scroll(1)}
            aria-label="Scroll right"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  );
};
