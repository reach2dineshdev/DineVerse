import { Link, useNavigate } from 'react-router-dom'
import movie_img from '../assets/movie.png'
import { useAuth } from '../AuthContext';

export const Card = ({ movie /* NOSONAR */ }) => {
  const navigate = useNavigate();
  const { currentUser, toggleSavedMovie, isMovieSaved } = useAuth();

  const { poster_path, id, overview, title, vote_average, vote_count /* NOSONAR */ } = movie;

  const image = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : movie_img;

  const formattedRating = vote_average ? Number(vote_average).toFixed(1) : 'N/A';
  const formattedVotes = vote_count ? Number(vote_count).toLocaleString() : '0';

  const saved = isMovieSaved ? isMovieSaved(id) : false;

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentUser) {
      toggleSavedMovie(movie);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="col">
      <div className="movie-card" title={title}>

        {/* Rating badge on poster */}
        <div className="rating-badge">
          <i className="bi bi-star-fill" style={{ color: 'var(--color-gold)' }}></i>
          {formattedRating}
        </div>

        {/* Save button overlaid on poster */}
        <button 
          onClick={handleSave}
          className="btn btn-sm btn-dark position-absolute border-0"
          style={{ 
            top: '10px', 
            left: '10px', 
            zIndex: 3, 
            borderRadius: '50%', 
            width: '32px', 
            height: '32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: saved ? 'rgba(229, 9, 20, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            transition: 'background 0.2s'
          }}
          title={saved ? "Remove from My List" : "Add to My List"}
        >
          <i className={`bi ${saved ? 'bi-check2' : 'bi-plus-lg'} text-white`} style={{ fontSize: '1.2rem' }}></i>
        </button>

        <img
          src={image}
          alt={title || 'Movie poster'}
          className="card-img-top"
          loading="lazy"
        />

        <div className="card-body">
          <h3 className="card-title text-overflow-1">
            {title || 'Title Not Available'}
          </h3>
          <p className="card-text text-overflow-2">
            {overview || 'No overview available at the moment. Stay tuned for updates.'}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <Link
              to={`/movie/${id}`}
              className="btn btn-sm btn-outline-primary stretched-link"
              style={{ borderRadius: '20px', padding: '4px 16px' }}
            >
              Read More
            </Link>
            <small style={{ color: 'var(--color-muted)', fontSize: '0.8rem', position: 'relative', zIndex: 2 }}>
              <i className="bi bi-people-fill text-success me-1"></i>
              {formattedVotes}
            </small>
          </div>
        </div>

      </div>
    </div>
  )
}
