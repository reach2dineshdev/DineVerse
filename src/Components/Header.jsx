import { NavLink, useNavigate, Link, useLocation } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "../AuthContext";
import { UseFetch } from "../Hooks/UseFetch";

export const Header = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, customAvatar } = useAuth();
  const { data: newMovies } = UseFetch("movie/now_playing");
  const notifications = newMovies ? newMovies.slice(0, 3) : [];
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const queryTerm = e.target.search.value;
    e.target.reset();
    return navigate(`/search?q=${queryTerm}`);
  };
  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${(scrolled && !isLoginPage) ? 'scrolled' : ''}`}>
        <div className="container-fluid px-4">
          <NavLink to="/" className="navbar-brand ms-2 me-5">
            <img src="/logo-red.png" alt="DineVerse" style={{ height: '48px' }} />
          </NavLink>
          {!isLoginPage && (
            <>
              <button
                type="button"
                className="navbar-toggler border-0"
                data-bs-toggle="collapse"
                data-bs-target="#menu"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="menu">
                <ul className="navbar-nav mb-2 mb-lg-0 me-auto">
                  <li className="nav-item me-3">
                    <NavLink to="/" end className="nav-link">Home</NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink to="/movies/top" className="nav-link">Top Rated</NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink to="/movies/popular" className="nav-link">Popular</NavLink>
                  </li>
                  <li className="nav-item me-3">
                    <NavLink to="/movies/upcoming" className="nav-link">Upcoming</NavLink>
                  </li>
                  {currentUser && (
                    <li className="nav-item me-3">
                      <NavLink to="/my-list" className="nav-link fw-bold">My List</NavLink>
                    </li>
                  )}
                </ul>
                <div className="d-flex align-items-center gap-4 ms-auto pe-2">
                  <form onSubmit={handleSearch} className={`search-container ${isSearchOpen ? 'open' : ''}`}>
                    <button type="button" className="search-btn" onClick={toggleSearch} title="Search">
                      <i className="bi bi-search"></i>
                    </button>
                    <input
                      type="search"
                      placeholder="Titles, people, genres..."
                      name="search"
                      className="search-input"
                      ref={searchInputRef}
                      onBlur={() => { if(!searchInputRef.current?.value) setIsSearchOpen(false) }}
                    />
                  </form>

                  {/* Notification Bell */}
                  <div className="position-relative cinematic-dropdown" style={{ cursor: 'pointer' }}>
                    <div className="d-flex align-items-center h-100 px-2">
                      <i className="bi bi-bell fs-5 text-light hover-glow"></i>
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger rounded-circle" style={{ marginTop: '8px', marginLeft: '-12px' }}>
                        <span className="visually-hidden">New alerts</span>
                      </span>
                    </div>
                    <div className="cinematic-dropdown-menu">
                      <div className="px-3 py-2 text-light fw-bold" style={{ fontSize: '1rem' }}>New Arrivals</div>
                      <div className="cinematic-dropdown-divider"></div>
                      {notifications.map((movie) => (
                        <Link key={movie.id} className="cinematic-dropdown-item" to={`/movie/${movie.id}`}>
                          <img 
                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : "https://via.placeholder.com/92x138?text=No+Poster"} 
                            alt="Poster" 
                            style={{width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px'}}
                          />
                          <div>
                            <div className="fw-bold text-light text-truncate" style={{fontSize: '0.9rem', maxWidth: '180px'}}>{movie.title}</div>
                            <div className="text-muted text-truncate" style={{fontSize: '0.8rem', maxWidth: '180px'}}>{movie.overview || "Now streaming."}</div>
                            <div className="text-primary mt-1" style={{fontSize: '0.7rem'}}>New</div>
                          </div>
                        </Link>
                      ))}
                      {notifications.length === 0 && (
                        <div className="p-3 text-muted text-center" style={{fontSize: '0.9rem'}}>No new notifications.</div>
                      )}
                    </div>
                  </div>

                  {/* User Profile */}
                  {currentUser ? (
                    <div className="d-flex align-items-center cinematic-dropdown profile-menu" style={{ cursor: 'pointer' }}>
                      <div className="d-flex align-items-center px-2">
                        <img src={customAvatar || currentUser.photoURL || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"} alt="Profile" className="rounded" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                        <i className="bi bi-caret-down-fill text-light ms-2" style={{ fontSize: '0.7rem', transition: 'transform 0.2s' }}></i>
                      </div>
                      <div className="cinematic-dropdown-menu" style={{ width: '220px' }}>
                        <div className="cinematic-dropdown-item py-3">
                          <img src={customAvatar || currentUser.photoURL || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"} alt="Profile" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }}/>
                          <span style={{fontSize:'0.9rem', fontWeight: 'bold'}}>{currentUser.displayName || 'User'}</span>
                        </div>
                        <Link className="cinematic-dropdown-item" to="/account">
                          <i className="bi bi-person fs-5 w-25 text-center"></i>
                          <span style={{fontSize:'0.9rem'}}>Account</span>
                        </Link>
                        <Link className="cinematic-dropdown-item" to="/help">
                          <i className="bi bi-question-circle fs-5 w-25 text-center"></i>
                          <span style={{fontSize:'0.9rem'}}>Help Center</span>
                        </Link>
                        <div className="cinematic-dropdown-divider mt-2 mb-2"></div>
                        <button type="button" className="cinematic-dropdown-item justify-content-center border-0 bg-transparent w-100 text-start" onClick={handleLogout} style={{fontSize:'0.9rem', padding: '16px'}}>
                          Sign out of DineVerse
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link to="/login" className="btn btn-danger btn-sm px-3 py-1 ms-2 fw-bold" style={{ borderRadius: '4px' }}>Sign In</Link>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
  )
}
