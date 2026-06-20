import { useEffect } from 'react';
import { HeroCarousel, MovieCarousel, Top10Carousel, TrendingToggle } from '../Components';
import { UseFetch } from '../Hooks/UseFetch';

export const Home = () => {
  useEffect(() => {
    document.title = 'DineVerse — Your Guide To Great Movies';
  }, []);

  const { data: nowPlaying } = UseFetch('movie/now_playing');
  const { data: trending   } = UseFetch('trending/movie/week');
  const { data: topRated   } = UseFetch('movie/top_rated');
  const { data: popular    } = UseFetch('movie/popular');
  const { data: upcoming   } = UseFetch('movie/upcoming');

  return (
    <div>
      {/* Hero Carousel — sits flush under the transparent navbar */}
      <HeroCarousel movies={nowPlaying} />

      {/* Netflix-style movie rows */}
      <main
        className="container-fluid px-4 px-lg-5 pb-5"
        style={{ marginTop: '2.5rem' }}
      >
        <Top10Carousel title="🏆 Top 10 Movies Today" movies={trending} />
        <TrendingToggle />
        <MovieCarousel title="🎬 Now Playing"        movies={nowPlaying} />
        <MovieCarousel title="🌟 Top Rated"          movies={topRated}   link="/movies/top" />
        <MovieCarousel title="🗓️ Upcoming Releases"  movies={upcoming}   link="/movies/upcoming" />
      </main>
    </div>
  );
};
