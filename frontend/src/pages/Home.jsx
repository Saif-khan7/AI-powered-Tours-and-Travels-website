import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

import Hero from '../components/travel/Hero';
import Destinations from '../components/travel/Destinations';
import ChatbotIcon from '../components/common/ChatbotIcon';

/* CSS: .home-card-container / .home-card provide the two feature cards */
function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Hero />
      <Destinations />

      <div className="home-card-container">
        <div className="home-card" onClick={() => navigate('/planner')}>
          <h2>Personalised Trip Planner</h2>
          <p>Tell us your preferences to get ideal destinations.</p>
          <button>Open Planner</button>
        </div>

        <div className="home-card" onClick={() => navigate('/itinerary')}>
          <h2>AI‑Based Itinerary</h2>
          <p>Generate a detailed multi‑day itinerary instantly.</p>
          <button>Start Building</button>
        </div>
        <div className="home-card" onClick={() => navigate('/hotels')}>
            <h2>Hotel Search</h2>
            <p>Find the best hotel deals in your destination.</p>
            <button>Search Hotels</button>
        </div>
      </div>
        
      {/* Auth‑gated advanced tools */}
      <SignedIn>
        {/* Extra user‑only helpers could appear here later */}
      </SignedIn>

      <SignedOut>
        {/* Optional nudge could go here */}
      </SignedOut>

      <ChatbotIcon onClick={() => alert('Chatbot coming soon!')} />
    </>
  );
}

export default Home;
