import React, { useState } from 'react'; // ✅ add useState here

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
import HotelPage from './pages/HotelPage';
import FlightPage from './pages/FlightPage';
import DestinationDetails from './components/travel/DestinationDetails';
import DestinationsPage from './pages/DestinationsPage';
import ToursPage from './pages/ToursPage'; 
import TourDetail from './pages/TourDetail';
import ChatbotIcon from './components/common/ChatbotIcon';
import ChatbotWindow from './components/common/ChatbotWindow';


import './App.css';

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
  const [showChat, setShowChat] = useState(false);

  return (
    <ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/tours" element={<ToursPage />} /> {/* ✅ New route */}
          <Route path="/planner" element={<RequireAuth><Planner /></RequireAuth>} />
          <Route path="/itinerary" element={<RequireAuth><ItineraryBuilder /></RequireAuth>} />
          <Route path="/hotels" element={<RequireAuth><HotelPage /></RequireAuth>} />
          <Route path="/flights" element={<RequireAuth><FlightPage /></RequireAuth>} />
          <Route path="/destination/:name" element={<DestinationDetails />} />
          <Route path="/tour/:name" element={<TourDetail />} />
          {/* Clerk auth pages */}
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
          {/* 404 Fallback */}
          <Route path="*" element={<p style={{ textAlign: 'center' }}>Page not found.</p>} />
        </Routes>

        <Footer />
        {/* Chatbot components (always visible) */}
        <ChatbotIcon onClick={() => setShowChat(true)} />
        {showChat && <ChatbotWindow onClose={() => setShowChat(false)} />}

      </Router>
    </ClerkProvider>
  );
}
