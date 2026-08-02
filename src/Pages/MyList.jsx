import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Card } from "../Components/Card";
import { useNavigate } from "react-router-dom";

export const MyList = () => {
  const { savedMovies, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "My List — DineVerse";
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <main className="container page-transition" style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <h2 className="section-heading mb-4">My List</h2>
      
      {savedMovies && savedMovies.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {savedMovies.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-5">
          <i className="bi bi-camera-reels text-muted" style={{ fontSize: '4rem' }}></i>
          <h4 className="mt-3 text-white">Your list is empty</h4>
          <p className="text-muted">Save shows and movies to keep track of what you want to watch.</p>
          <button className="btn btn-outline-light mt-3 px-4" onClick={() => navigate('/movies/popular')}>
            Explore Popular Movies
          </button>
        </div>
      )}
    </main>
  );
};
