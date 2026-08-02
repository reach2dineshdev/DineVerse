import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Card } from '../Components'
import { UseFetch } from "../Hooks/UseFetch";

const IS_HOME_PAGE = "Your Guide To Great Movies";

export const MovieList = ({ title, apiPath }) => {

  useEffect(() => {
    document.title = title === IS_HOME_PAGE ? "DineVerse — Your Guide To Great Movies" : `${title} — DineVerse`;
  }, [title]);

  const navigator = useNavigate();
  const { data: movies } = UseFetch(apiPath);

  const isHome = title === IS_HOME_PAGE;

  // Pick a random top-5 movie for the hero background
  const heroMovie = movies.length > 0
    ? movies[Math.floor(Math.random() * Math.min(5, movies.length))]
    : null;
  const heroBg = heroMovie?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
    : null;

  return (
    <div className="page-transition">
      <main className="container">

        {/* ── HERO SECTION (home page only) ── */}
        {isHome && (
          <div className="hero shadow-lg">
            {heroBg && (
              <img src={heroBg} className="hero-bg" alt="" loading="lazy" />
            )}
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h1 className="hero-title">Welcome to DineVerse</h1>
              <p className="hero-text">
                Movies are more than entertainment — they are stories that inspire, thrill,
                and transport us to different worlds. Discover the magic of cinema right here.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2"
                  onClick={() => navigator("/movies/upcoming")}
                >
                  Explore Upcoming
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light px-4 py-2"
                  onClick={() => navigator("/movies/top")}
                >
                  Top Rated
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION HEADING ── */}
        <h2 className="section-heading">
          {isHome ? "Trending Now" : title}
        </h2>

        {/* ── MOVIE GRID ── */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 pb-5">
          {movies.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>

      </main>
    </div>
  )
}
