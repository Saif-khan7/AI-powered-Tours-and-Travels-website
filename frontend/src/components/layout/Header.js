import React from 'react';
import { Link } from 'react-router-dom';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton
} from '@clerk/clerk-react';

/* Sticky header styled via App.css > header …  */
function Header() {
  return (
    <header>
      <div className="logo">
        <Link to="/">AI Travel Planner</Link>
      </div>

      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>

          {/* add future links here */}

          <SignedIn>
            <li><UserButton afterSignOutUrl="/" /></li>
          </SignedIn>

          <SignedOut>
            <li><SignInButton mode="modal" redirectUrl="/" /></li>
          </SignedOut>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
