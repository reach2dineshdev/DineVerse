import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import movie_img from '../assets/movie.png'
import { convertMinutes, formatMoney, formatDate } from "../Utils/utils";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const MovieDetails = () => {

  const { id } = useParams();
  const mediaType = window.location.pathname.includes('/tv/') ? 'tv' : 'movie';
  const [movie, setMovie] = useState({});
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [cast, setCast] = useState([]);
  const key = import.meta.env.VITE_API_KEY;
  const { currentUser, isMovieSaved, toggleSavedMovie } = useAuth();
  const navigate = useNavigate();

  const saved = isMovieSaved ? isMovieSaved(movie.id) : false;

  const handleSave = () => {
    if (currentUser) {
      toggleSavedMovie(movie);
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    // Scroll to top when ID changes
    window.scrollTo(0, 0);

    const url = `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${key}`;
    const videosUrl = `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${key}`;
    const recsUrl = `https://api.themoviedb.org/3/${mediaType}/${id}/recommendations?api_key=${key}`;
    const creditsUrl = `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${key}`;

    async function fetchMovieData() {
      // Fetch details
      const res = await fetch(url);
      const data = await res.json();
      
      // Map 'name' to 'title' if it's a TV show so the rest of the component works normally
      if (mediaType === 'tv') {
        data.title = data.name;
        data.runtime = data.episode_run_time ? data.episode_run_time[0] : 0;
        data.release_date = data.first_air_date;
      }
      
      setMovie(data);

      // Fetch videos
      const vidRes = await fetch(videosUrl);
      const vidData = await vidRes.json();
      if (vidData.results) {
        const trailer = vidData.results.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
        setTrailerKey(trailer ? trailer.key : null);
      }

      // Fetch recommendations
      const recRes = await fetch(recsUrl);
      const recData = await recRes.json();
      if (recData.results) {
        const mappedRecs = recData.results.map(item => ({
          ...item,
          title: item.title || item.name,
          media_type: mediaType
        }));
        setRecommendations(mappedRecs.slice(0, 10)); // Top 10
      }

      // Fetch Cast
      const creditsRes = await fetch(creditsUrl);
      const creditsData = await creditsRes.json();
      if (creditsData.cast) {
        setCast(creditsData.cast.slice(0, 12)); // Top 12 cast members
      }
    }
    fetchMovieData();
  }, [id, key, mediaType]);

  useEffect(() => {
    if (movie.title) {
      document.title = `${movie.title} — DineVerse`;
    }
  }, [movie.title]);

  const poster   = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie_img;
  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A';
  const votes  = movie.vote_count   ? Number(movie.vote_count).toLocaleString() : '0';

  return (
    <div className="page-transition">

      {/* Blurred backdrop behind entire page */}
      {backdrop && (
        <div
          className="movie-backdrop"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
      )}

      <main className="container pb-5">

        {/* Page breadcrumb title */}
        <h2 className="section-heading">{movie.title || 'Movie Details'}</h2>

        <div className="row g-5">

          {/* ── POSTER ── */}
          <div className="col-md-4 col-lg-3">
            <img
              src={poster}
              alt={movie.title}
              className="img-fluid"
              loading="lazy"
              style={{
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--color-border)',
                width: '100%',
              }}
            />
          </div>

          {/* ── DETAILS ── */}
          <div className="col-md-8 col-lg-9">

            <h1 className="hero-title mb-1">
              {movie.title || 'Title Not Available'}
            </h1>

            {movie.tagline && (
              <p className="fst-italic mb-4" style={{ color: 'var(--color-muted)', fontSize: '1.05rem' }}>
                "{movie.tagline}"
              </p>
            )}

            <p className="mb-4" style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.75 }}>
              {movie.overview || 'No overview available at the moment. Stay tuned for updates.'}
            </p>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span key={g.id} className="genre-badge">{g.name}</span>
                ))}
              </div>
            )}

            {/* Rating row */}
            <div className="d-flex align-items-center gap-4 mb-4">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-star-fill fs-4" style={{ color: 'var(--color-gold)' }}></i>
                <span className="fw-bold fs-4 text-white">{rating}</span>
                <span style={{ color: 'var(--color-muted)' }}>/ 10</span>
              </div>
              <div className="d-flex align-items-center gap-2" style={{ color: 'var(--color-muted)' }}>
                <i className="bi bi-people-fill text-success fs-5"></i>
                <span>{votes} reviews</span>
              </div>
            </div>

            {/* Stat chips */}
            <div className="stat-chips-row">
              <div className="stat-chip">
                <span className="stat-chip-label">Runtime</span>
                <span className="stat-chip-value">{convertMinutes(movie.runtime)}</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-label">Budget</span>
                <span className="stat-chip-value">{formatMoney(movie.budget)}</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-label">Revenue</span>
                <span className="stat-chip-value">{formatMoney(movie.revenue)}</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-label">Release Date</span>
                <span className="stat-chip-value">{formatDate(movie.release_date)}</span>
              </div>
            </div>

            {/* IMDb CTA */}
            <div className="d-flex flex-wrap gap-3 mt-4">
              {movie.imdb_id && (
                <a
                  className="btn btn-warning px-4 py-2"
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                >
                  <i className="bi bi-film me-2"></i>View on IMDb
                </a>
              )}

              {/* Watch Trailer CTA */}
              {trailerKey && (
                <button
                  className="btn btn-primary px-4 py-2"
                  onClick={() => setShowTrailer(true)}
                >
                  <i className="bi bi-play-fill me-2 fs-5" style={{verticalAlign: 'middle'}}></i>Watch Trailer
                </button>
              )}
              
              {/* My List CTA */}
              <button
                className={`btn px-4 py-2 ${saved ? 'btn-danger' : 'btn-outline-light'}`}
                onClick={handleSave}
              >
                <i className={`bi ${saved ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                {saved ? 'Remove from My List' : 'Add to My List'}
              </button>
            </div>
          </div>

        </div>

        {/* ── TOP CAST (ACTOR UNIVERSE) ── */}
        {cast.length > 0 && (
          <div className="mt-5 pt-4 border-top border-secondary" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
            <h3 className="text-white fw-bold mb-4"><i className="bi bi-people-fill text-primary me-2"></i>Top Cast</h3>
            <div className="d-flex gap-3 overflow-auto pb-3 custom-scrollbar">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center flex-shrink-0" style={{ width: '120px' }}>
                  <img 
                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://via.placeholder.com/120x180?text=No+Photo"} 
                    alt={actor.name}
                    className="rounded shadow-sm mb-2"
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                  />
                  <div className="text-light fw-bold text-truncate" style={{ fontSize: '0.85rem' }}>{actor.name}</div>
                  <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{actor.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MORE LIKE THIS (RABBIT HOLE) ── */}
        {recommendations.length > 0 && (
          <div className="mt-5 pt-4 border-top border-secondary" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
            <h3 className="text-white fw-bold mb-4"><i className="bi bi-stars text-primary me-2"></i>More Like This</h3>
            <div className="d-flex gap-3 overflow-auto pb-3 custom-scrollbar">
              {recommendations.map((rec) => (
                <Link key={rec.id} to={`/movie/${rec.id}`} className="text-decoration-none flex-shrink-0" style={{ width: '150px' }}>
                  <img 
                    src={rec.poster_path ? `https://image.tmdb.org/t/p/w200${rec.poster_path}` : "https://via.placeholder.com/150x225?text=No+Poster"} 
                    alt={rec.title}
                    className="rounded shadow-sm mb-2"
                    style={{ width: '100%', height: '225px', objectFit: 'cover', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div className="text-light fw-bold text-truncate" style={{ fontSize: '0.9rem' }}>{rec.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── TRAILER MODAL ── */}
      {showTrailer && trailerKey && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999 }}>
          <div className="position-relative w-100" style={{ maxWidth: '900px', padding: '20px' }}>
            <button 
              className="btn btn-dark position-absolute rounded-circle d-flex align-items-center justify-content-center shadow-lg"
              style={{ top: '-10px', right: '0px', width: '40px', height: '40px', border: '2px solid white' }}
              onClick={() => setShowTrailer(false)}
            >
              <i className="bi bi-x-lg text-white"></i>
            </button>
            <div className="ratio ratio-16x9 shadow-lg rounded overflow-hidden bg-black">
              <iframe 
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
