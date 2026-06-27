import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";

export const Account = () => {
  const { currentUser, logout, savedMovies, clearSavedMovies, customAvatar, updateCustomAvatar } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [showAvatarGrid, setShowAvatarGrid] = useState(false);

  const avatars = [
    "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png",
    "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg",
    "https://i.pinimg.com/originals/b6/77/cd/b677cd1cde292f261166533d6fe75872.png",
    "https://pro2-bar-s3-cdn-cf.myportfolio.com/dddb0c1b4ab622854dd81280840458d3/877ad1ce3a479ef9498e1efc_rw_600.png?h=794db6a6ae01c539fdfb7ad5e5a89589",
    "https://mir-s3-cdn-cf.behance.net/project_modules/disp/84c20033850498.56ba69ac290ea.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/disp/64623a33850498.56ba69ac2a6f7.png"
  ];

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || "");
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage("");
    
    try {
      await updateProfile(currentUser, {
        displayName: displayName
      });
      setUpdateMessage("Profile updated successfully! Refresh to see changes globally.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateMessage("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateAvatar = async (url) => {
    try {
      await updateProfile(currentUser, { photoURL: url });
      updateCustomAvatar(null); // Clear custom avatar if they pick a preset
      setShowAvatarGrid(false);
      setUpdateMessage("Avatar updated successfully! Refresh to see changes.");
    } catch (error) {
      console.error("Error updating avatar:", error);
      setUpdateMessage("Failed to update avatar.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCustomAvatar(reader.result);
        setShowAvatarGrid(false);
        setUpdateMessage("Local avatar applied successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearList = () => {
    if (globalThis.confirm("Are you sure you want to clear your entire 'My List'? This cannot be undone.")) {
      clearSavedMovies();
    }
  };

  return (
    <div className="page-transition position-relative" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px' }}>
      
      {/* Cinematic Background */}
      <div 
        className="position-fixed top-0 start-0 w-100 h-100" 
        style={{ 
          backgroundImage: "url('/login-bg.png')", 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          opacity: 0.5,
          zIndex: -1
        }} 
      />

      <div className="glass-panel w-100" style={{ maxWidth: '800px', borderRadius: '24px', padding: '40px' }}>
        
        {/* Profile Overview */}
        <div className="text-center mb-5">
          <div 
            className="position-relative d-inline-block mb-3" 
            style={{ cursor: 'pointer' }}
            onClick={() => setShowAvatarGrid(!showAvatarGrid)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowAvatarGrid(!showAvatarGrid); } }}
            role="button"
            tabIndex={0}
          >
            <img 
              src={customAvatar || currentUser.photoURL || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"} 
              alt="Profile" 
              className="rounded-circle shadow-lg" 
              style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid var(--color-primary)', padding: '4px', transition: 'transform 0.2s' }} 
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onFocus={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onBlur={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
            <div className="position-absolute bottom-0 end-0 bg-primary rounded-circle" style={{ width: '28px', height: '28px', border: '3px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-camera-fill text-white" style={{ fontSize: '12px' }}></i>
            </div>
          </div>
          <h2 className="fw-bold mb-1" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>{currentUser.displayName || 'User'}</h2>
          <p className="text-light opacity-75 fs-5 mb-0">{currentUser.email}</p>
        </div>
        
        {/* Avatar Selection Grid (Hidden by default) */}
        {showAvatarGrid && (
          <div className="mb-5 bg-black p-4 rounded-4 border border-secondary shadow-lg">
            <h5 className="text-white mb-3 text-center">Choose an Avatar</h5>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {avatars.map((url) => (
                <img 
                  key={url}
                  src={url}
                  alt="Avatar option"
                  className="rounded-circle cursor-pointer border border-2 border-transparent"
                  style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => handleUpdateAvatar(url)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleUpdateAvatar(url); } }}
                  role="button"
                  tabIndex={0}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.borderColor = 'var(--color-primary)' }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'transparent' }}
                  onFocus={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.borderColor = 'var(--color-primary)' }}
                  onBlur={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'transparent' }}
                />
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <label className="btn btn-outline-light btn-sm px-4 rounded-pill">
                <i className="bi bi-upload me-2"></i> Upload from Device{" "}
                <input type="file" accept="image/*" className="d-none" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        )}

        <hr className="border-secondary my-5" style={{ opacity: 0.3 }} />
        
        {/* Profile Personalization */}
        <div className="row align-items-center mb-5">
          <div className="col-md-5 mb-3 mb-md-0">
            <h4 className="text-white fw-bold mb-1"><i className="bi bi-person-badge me-2 text-primary"></i> Personalization</h4>
            <p className="text-muted small mb-0">Update how your name appears across DineVerse.</p>
          </div>
          <div className="col-md-7">
            <form onSubmit={handleUpdateProfile}>
              <div className="input-group shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <input 
                  type="text" 
                  className="form-control cinematic-input border-0" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                />
                <button 
                  className="btn btn-primary px-4 fw-bold" 
                  type="submit" 
                  disabled={isUpdating || displayName === currentUser.displayName}
                >
                  {isUpdating ? 'Saving...' : 'Save'}
                </button>
              </div>
              {updateMessage && (
                <div className={`mt-2 small ${updateMessage.includes('Failed') ? 'text-danger' : 'text-success'}`}>
                  <i className={`bi ${updateMessage.includes('Failed') ? 'bi-exclamation-circle' : 'bi-check-circle'} me-1`}></i>
                  {updateMessage}
                </div>
              )}
            </form>
          </div>
        </div>

        <hr className="border-secondary my-5" style={{ opacity: 0.3 }} />

        {/* Library Management */}
        <div className="row align-items-center">
          <div className="col-md-5 mb-3 mb-md-0">
            <h4 className="text-white fw-bold mb-1"><i className="bi bi-collection-play me-2 text-primary"></i> Library Management</h4>
            <p className="text-muted small mb-0">Manage your saved movies and shows.</p>
          </div>
          <div className="col-md-7">
            <div className="d-flex justify-content-between align-items-center bg-black p-3 rounded-3 border border-secondary mb-3 shadow-sm" style={{ borderColor: 'rgba(255,255,255,0.1) !important' }}>
              <div>
                <h6 className="mb-0 text-white fw-bold">Movies in "My List"</h6>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Total saved items</span>
              </div>
              <div className="bg-primary bg-opacity-25 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px', border: '1px solid var(--color-primary)' }}>
                {savedMovies ? savedMovies.length : 0}
              </div>
            </div>
            
            <button 
              className="btn btn-outline-danger w-100 fw-bold py-2 rounded-3" 
              onClick={handleClearList}
              disabled={!savedMovies || savedMovies.length === 0}
              style={{ transition: 'all 0.2s' }}
            >
              <i className="bi bi-trash3-fill me-2"></i> Clear My List
            </button>
          </div>
        </div>

        <hr className="border-secondary my-5" style={{ opacity: 0.3 }} />
        
        {/* Sign Out */}
        <div className="text-center">
          <button className="btn btn-dark border-secondary px-5 py-2 rounded-pill shadow-sm hover-glow" onClick={async () => {
            await logout();
            navigate('/login');
          }}>
            <i className="bi bi-box-arrow-right me-2"></i> Sign Out of DineVerse
          </button>
        </div>
        
      </div>
    </div>
  );
};
