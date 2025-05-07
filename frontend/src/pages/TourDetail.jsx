import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TourDetail.css';

function TourDetail() {
  const { name } = useParams();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/tours/${encodeURIComponent(name)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setTour(data);
      })
      .catch(() => setError('Failed to load tour details.'));
  }, [name]);

  if (error) return <div className="tour-container"><h2>{error}</h2></div>;
  if (!tour) return <div className="tour-container"><p>Loading...</p></div>;

  return (
    <div className="tour-container">
      <img src={tour.image} alt={tour.name} className="tour-image" />
      <div className="tour-details">
        <h1>{tour.name}</h1>
        <p className="location">{tour.location}</p>
        <p className="description">{tour.description}</p>
        <p><strong>Duration:</strong> {tour.duration}</p>
        <p><strong>Price:</strong> {tour.price}</p>
        <h3>Highlights</h3>
        <ul>
          {tour.highlights.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TourDetail;
