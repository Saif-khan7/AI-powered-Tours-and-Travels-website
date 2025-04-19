import React from 'react';
import dest1 from '../../assets/images/destination-1.png';
import dest2 from '../../assets/images/destination-2.png';
import dest3 from '../../assets/images/destination-3.png';

/* Uses .destinations, .cards, .card … CSS rules */
const mock = [
  { title: 'Paris',  description: 'City of love, lights & art',       img: dest1 },
  { title: 'Bali',   description: 'Tropical paradise & beaches',      img: dest2 },
  { title: 'Tokyo',  description: 'Tradition meets tech',             img: dest3 }
];

function Destinations() {
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
              <button>Explore</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Destinations;
