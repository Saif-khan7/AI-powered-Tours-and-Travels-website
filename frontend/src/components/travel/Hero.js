import React from 'react';

/* Matches .hero & .hero-content selectors in App.css */
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1>Plan Your Perfect Trip with AI</h1>
        <p>
          Discover personalised recommendations and craft custom itineraries in minutes.
        </p>

        {/* Decorative search bar (non‑functional for now) */}
        <div className="search-bar">
          <input type="text" placeholder="Where do you want to go?" />
          <button>Search</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
