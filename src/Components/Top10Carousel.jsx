import { Link } from 'react-router-dom';
import { useCarousel } from '../Hooks/useCarousel';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';

export const Top10Carousel = ({ title, movies = [] /* NOSONAR */ }) => {
  const { trackRef, atStart, atEnd, scrollPos, scroll } = useCarousel([movies]);

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
