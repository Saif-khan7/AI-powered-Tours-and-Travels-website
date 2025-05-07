import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/clerk-react';

function Header() {
  return (
    <header>
      <div className="logo">
        <Link to="/" style={{ textDecoration: 'none', color: '#0096b2' }}>
          ✈ <strong>TravelAI</strong>
        </Link>
      </div>

      <nav>
        <ul>
          <li><NavLink to="/destinations">📍 Destinations</NavLink></li>
          <li><NavLink to="/tours">🌐 Tours</NavLink></li> {/* ✅ Added Tours link */}
          <li><NavLink to="/planner">🧠 Trip Planner</NavLink></li>
          <li><NavLink to="/itinerary">🗺️ Itinerary Builder</NavLink></li>
        </ul>
      </nav>

      <div className="auth-buttons">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" redirectUrl="/" />
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
