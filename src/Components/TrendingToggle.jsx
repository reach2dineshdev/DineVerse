import { useState, useEffect } from 'react';
import { MovieCarousel } from './MovieCarousel';

export const TrendingToggle = () => {
  const [mediaType, setMediaType] = useState('movie'); // 'movie' or 'tv'
  const [movies, setMovies] = useState([]);
  const key = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchTrending = async () => {
      // Always fetch for the 'day' window to keep it fresh, but toggle media type!
      const url = `https://api.themoviedb.org/3/trending/${mediaType}/day?api_key=${key}`;
      const res = await fetch(url);
      const data = await res.json();
      
      // If we fetch TV shows, they use 'name' instead of 'title'. 
      // We need to map them so MovieCarousel can display them properly if it expects 'title'.
      const mappedResults = (data.results || []).map(item => ({
        ...item,
        title: item.title || item.name // Ensure 'title' exists
      }));
      setMovies(mappedResults);
    };
    fetchTrending();
  }, [mediaType, key]);

  const headerTitle = (
    <div className="d-flex align-items-center flex-wrap gap-3 mb-3 position-relative" style={{ zIndex: 10 }}>
      <h2 className="movie-row__title mb-0" style={{ fontSize: '1.5rem' }}>
        Trending <span className="text-primary">{mediaType === 'movie' ? 'Movies' : 'TV Shows'}</span>
      </h2>
      
      {/* Toggle UI styled like TMDB */}
      <div className="d-flex rounded-pill border border-secondary ms-auto" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        <button 
          className={`btn btn-sm rounded-pill px-4 fw-bold ${mediaType === 'movie' ? 'btn-primary text-white' : 'btn-transparent text-light'}`}
          style={{ transition: 'all 0.2s', border: 'none', borderRadius: '30px', cursor: 'pointer' }}
          onClick={() => setMediaType('movie')}
        >
          Movies
        </button>
        <button 
          className={`btn btn-sm rounded-pill px-4 fw-bold ${mediaType === 'tv' ? 'btn-primary text-white' : 'btn-transparent text-light'}`}
          style={{ transition: 'all 0.2s', border: 'none', borderRadius: '30px', cursor: 'pointer' }}
          onClick={() => setMediaType('tv')}
        >
          TV Shows
        </button>
      </div>
    </div>
  );

  return (
    <div className="mb-5">
      {headerTitle}
      <div>
        <MovieCarousel 
          title="" 
          movies={movies} 
        />
      </div>
    </div>
  );
};

