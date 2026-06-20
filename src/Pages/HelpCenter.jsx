import { Link } from "react-router-dom";

export const HelpCenter = () => {
  return (
    <div className="page-transition position-relative" style={{ minHeight: '100vh', padding: '120px 20px 60px' }}>
      
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

      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div className="text-center mb-5">
          <i className="bi bi-info-circle-fill text-primary" style={{ fontSize: '3rem' }}></i>
          <h1 className="fw-bold text-white mt-3 mb-2" style={{ fontSize: '3rem', letterSpacing: '-1px' }}>Help Center</h1>
          <p className="text-light opacity-75 fs-5">Everything you need to know about DineVerse.</p>
        </div>

        <div className="glass-panel p-4 p-md-5 rounded-4 shadow-lg mb-5">
          <h3 className="text-white fw-bold mb-4 border-bottom border-secondary pb-3">Frequently Asked Questions</h3>
          
          <div className="accordion accordion-flush cinematic-accordion" id="helpAccordion">
            
            {/* FAQ 1 */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                  <i className="bi bi-collection-play text-primary me-3"></i> How do I add a movie to "My List"?
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                <div className="accordion-body">
                  To save a movie to your personal list, simply navigate to any movie's detail page and click the <strong>"Add to List"</strong> button (represented by a heart icon). You must be signed in to your account to save movies. You can view all your saved movies by clicking "My List" in the top navigation bar.
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                  <i className="bi bi-person-badge text-primary me-3"></i> How do I change my profile picture?
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                <div className="accordion-body">
                  Changing your profile picture is easy! Click your profile icon in the top right corner and select <strong>Account</strong>. From the Account dashboard, click on your large profile picture to open the Avatar Selector. You can choose from one of our premium preset avatars, or click "Upload from Device" to use your own image!
                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                  <i className="bi bi-bell text-primary me-3"></i> What are the notifications in the top right?
                </button>
              </h2>
              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                <div className="accordion-body">
                  The notification bell keeps you up to date with the latest additions to DineVerse. It automatically fetches the newest, most recently released movies ("Now Playing") and displays them for you. Clicking on a notification will take you directly to that movie's page so you can start exploring it immediately!
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                  <i className="bi bi-credit-card text-primary me-3"></i> Is DineVerse free to use?
                </button>
              </h2>
              <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#helpAccordion">
                <div className="accordion-body">
                  Yes! DineVerse is a completely free, open-source project designed as a modern streaming interface. You can browse thousands of movies, watch trailers, and manage your personal library without ever needing a subscription or credit card.
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="text-center mt-5">
          <Link to="/" className="btn btn-outline-light rounded-pill px-5 py-2">
            <i className="bi bi-arrow-left me-2"></i> Return Home
          </Link>
        </div>

      </div>
    </div>
  );
};
