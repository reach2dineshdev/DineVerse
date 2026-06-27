import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

export const Top10Carousel = ({ title, movies = [] /* NOSONAR */ }) => {
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
          {movies.slice(0, 10).map((movie, index) => {
            // Use poster path instead of backdrop for Top 10 to match Netflix style
            const poster = movie.poster_path
              ? `${TMDB_IMG}${movie.poster_path}`
              : null;


            return (
              <div key={movie.id} className="top10-card-wrapper">
                <span className="top10-number">{index + 1}</span>
                <Link
                  to={`/movie/${movie.id}`}
                  className="movie-row__card"
                  title={movie.title}
                  style={{ width: '160px', aspectRatio: '2 / 3' }} // override landscape width for Top 10
                >
                  <div className="movie-row__card-inner">
                    {poster ? (
                      <img
                        src={poster}
                        alt={movie.title}
                        className="movie-row__poster"
                        loading="lazy"
                        style={{ aspectRatio: '2 / 3' }} // portrait ratio
                      />
                    ) : (
                      <div className="movie-row__no-poster" style={{ aspectRatio: '2 / 3' }}>
                        <i className="bi bi-film" style={{ fontSize: '2rem' }}></i>
                      </div>
                    )}

                    {/* Hover panel removed for Top 10 cards to prevent overlapping interactive elements in the row below */}
                  </div>
                </Link>
              </div>
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
