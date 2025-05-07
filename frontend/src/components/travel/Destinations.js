import React from 'react';
import { useNavigate } from 'react-router-dom';

import dest1 from '../../assets/images/paris.png';
import dest2 from '../../assets/images/destination-2.png';
import dest3 from '../../assets/images/destination-3.png';

/* CSS classes used: .destinations, .cards, .card, etc. */

const mock = [
  { title: 'Paris', description: 'City of love, lights & art', img: dest1 },
  { title: 'Bali', description: 'Tropical paradise & beaches', img: dest2 },
  { title: 'Tokyo', description: 'Tradition meets tech', img: dest3 }
];

function Destinations() {
  const navigate = useNavigate();

  const handleExplore = (destinationName) => {
    navigate(`/destination/${encodeURIComponent(destinationName)}`);
  };

  return (
    <section className="destinations">
      <h2>Trending Destinations</h2>

      <div className="cards">
        {mock.map(({ title, description, img }) => (
          <div className="card" key={title}>
            <img src={img} alt={title} />
            <div className="card-content">
              <h3>{title}</h3>
              <p>{description}</p>
              <button onClick={() => handleExplore(title)}>Explore</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Destinations;
