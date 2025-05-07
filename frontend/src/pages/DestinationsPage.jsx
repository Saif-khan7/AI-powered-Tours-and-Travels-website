import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllDestinations } from '../services/api';
import './DestinationsPage.css';

function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllDestinations()
      .then(setDestinations)
      .catch(() => setDestinations([]));
  }, []);

  const filtered = destinations.filter(dest =>
    dest.name.toLowerCase().includes(query.toLowerCase()) ||
    dest.country?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="destinations-page">
      <h1>Find your perfect destination from our collection of stunning locations worldwide</h1>

      <div className="search-wrapper">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search destination…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="icon">🔍</span>
        </div>
      </div>

      <div className="cards-grid">
        {filtered.map(dest => (
          <div
            className="destination-card"
            key={dest.name}
            onClick={() => navigate(`/destination/${dest.name}`)}
          >
            <img src={dest.cardImage || dest.heroImage} alt={dest.name} />
            <h3>{dest.name}</h3>
            <p>{dest.country || dest.tagline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DestinationsPage;
