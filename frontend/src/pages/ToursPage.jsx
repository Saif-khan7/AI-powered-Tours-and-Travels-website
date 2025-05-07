import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllTours } from '../services/api'; // Create this in your API service
import './DestinationsPage.css'; // Reuse same styles for layout consistency

function ToursPage() {
  const [tours, setTours] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllTours()
      .then(setTours)
      .catch(() => setTours([]));
  }, []);

  const filtered = tours.filter(t =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.location?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="destinations-page">
      <h1>Explore our carefully curated tour packages for unforgettable travel experiences</h1>

      <div className="search-wrapper">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tour…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="icon">🔍</span>
        </div>
      </div>

      <div className="cards-grid">
        {filtered.map(tour => (
          <div
            className="destination-card"
            key={tour._id}
            onClick={() => navigate(`/tour/${tour.name}`)}
          >
            <img src={tour.image} alt={tour.name} />
            <h3>{tour.name}</h3>
            <p>{tour.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ToursPage;
