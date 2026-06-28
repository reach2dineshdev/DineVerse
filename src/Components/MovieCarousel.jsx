import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useCarousel } from '../Hooks/useCarousel';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w780';

export const MovieCarousel = ({ title, movies = [], link /* NOSONAR */ }) => {
  const { currentUser, toggleSavedMovie, isMovieSaved } = useAuth();
  const navigate = useNavigate();
  
  const { trackRef, atStart, atEnd, scrollPos, scroll } = useCarousel([movies]);

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

            const saved = isMovieSaved ? isMovieSaved(movie.id) : false;

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
                      <div 
                        className="movie-row__panel-btn"
                        title={saved ? "Remove from My List" : "Add to My List"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (currentUser) {
                            toggleSavedMovie(movie);
                          } else {
                            navigate('/login');
                          }
                        }}
                      >
                        <i className={`bi ${saved ? 'bi-check2' : 'bi-plus'} fs-4`}></i>
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
