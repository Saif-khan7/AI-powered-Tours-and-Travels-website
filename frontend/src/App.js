import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp
} from '@clerk/clerk-react';

import Home from './pages/Home';
import Planner from './components/travel/Planner';
import ItineraryBuilder from './components/travel/ItineraryBuilder';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HotelPage       from './pages/HotelPage';

import './App.css';

/* Convenience wrapper for future protected routes */
function RequireAuth({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
      <Router>
        <Header />

        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/planner"  element={<RequireAuth><Planner /></RequireAuth>} />
          <Route path="/itinerary" element={<RequireAuth><ItineraryBuilder /></RequireAuth>} />
          <Route path="/hotels"   element={<RequireAuth><HotelPage /></RequireAuth>} />

          {/* Clerk pages */}
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />

          {/* 404 */}
          <Route path="*" element={<p style={{ textAlign: 'center' }}>Page not found.</p>} />
        </Routes>

        <Footer />
      </Router>
    </ClerkProvider>
  );
}
