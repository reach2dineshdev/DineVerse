import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseFetch } from "../Hooks/UseFetch";

export const Login = () => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, currentUser } = useAuth();
  const navigate = useNavigate();
  const [bgImage, setBgImage] = useState("");
  const { data: movies } = UseFetch("movie/popular");

  // Form State
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movies && movies.length > 0) {
      // Pick a random movie from the popular list for the background
      // NOSONAR
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      if (randomMovie.backdrop_path) {
        setBgImage(`https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`);
      }
    }
  }, [movies]);

  useEffect(() => {
    // If user is already logged in, redirect them to the home page
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      console.error("Failed to sign in with Google", error);
      setError("Failed to sign in with Google.");
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setLoading(true);
    try {
      if (isSignUp) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      navigate("/");
    } catch (err) {
      console.error("Firebase Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else if (err.code === 'auth/operation-not-allowed') {
        setError("Email/Password sign-in is not enabled in your Firebase Console.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else {
        setError(`Failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  let submitText = "Sign In";
  if (loading) submitText = "Please wait...";
  else if (isSignUp) submitText = "Sign Up";

  return (
    <div 
      className="login-container d-flex flex-column align-items-center justify-content-center" 
      style={{ 
        minHeight: '100vh', 
        background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url(${bgImage || '"/login-bg.png"'}) no-repeat center center / cover`,
        transition: 'background 0.5s ease-in-out'
      }}
    >

      <div className="login-box p-5 rounded login-glass" style={{ width: '100%', maxWidth: '450px', marginTop: '40px' }}>
        <h1 className="text-white mb-4 fw-bold" style={{ fontSize: '2.2rem', letterSpacing: '1px' }}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>
        
        {error && <div className="alert alert-danger py-2" style={{ fontSize: '0.9rem' }}>{error}</div>}
        
        <form onSubmit={handleEmailAuth}>
          <div className="mb-3 position-relative">
            <input 
              type="email" 
              className="form-control login-input text-white" 
              placeholder="Email or phone number" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 position-relative">
            <input 
              type="password" 
              className="form-control login-input text-white" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            className="btn text-white w-100 mb-3 login-btn-glow" 
            type="submit"
            disabled={loading}
          >
            {submitText}
          </button>
          
          <div className="d-flex justify-content-between mb-4" style={{ fontSize: '0.85rem', color: '#B3B3B3' }}>
            <div className="d-flex align-items-center">
              <input type="checkbox" id="rememberMe" className="me-2" defaultChecked style={{ accentColor: '#e50914' }} />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <button type="button" className="text-decoration-none hover-glow border-0 bg-transparent p-0" style={{ color: '#B3B3B3' }}>Need help?</button>
          </div>
          
          <button 
            type="button" 
            onClick={handleGoogleSignIn}
            className="btn login-btn-google w-100 fw-bold d-flex align-items-center justify-content-center gap-3 py-3"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" style={{width: '24px'}}/>{" "}
            Sign in with Google
          </button>
        </form>

        <div className="mt-5" style={{ fontSize: '0.95rem', color: '#B3B3B3' }}>
          <p>
            {isSignUp ? "Already have an account?" : "New to DineVerse?"} 
            <button 
              type="button"
              className="text-white fw-bold text-decoration-none hover-glow ms-2 border-0 bg-transparent p-0"
              onClick={(e) => {
                e.preventDefault();
                setIsSignUp(!isSignUp);
                setError("");
              }}
            >
              {isSignUp ? "Sign in now." : "Sign up now."}
            </button>
          </p>
          <p style={{ fontSize: '0.8rem', color: '#8c8c8c' }} className="mt-3">
            This page is protected by Google reCAPTCHA to ensure you're not a bot. <button type="button" className="text-primary text-decoration-none border-0 bg-transparent p-0">Learn more.</button>
          </p>
        </div>
      </div>
    </div>
  );
};
