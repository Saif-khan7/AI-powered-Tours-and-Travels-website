import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './DestinationDetails.css';

const GOOGLE_MAPS_API_KEY = "AIzaSyAdJInjXdaV54_AXgUjVX7ZMskP4p9vQiw"; // Replace with your key

function DestinationDetails() {
  const { name } = useParams();
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/destinations/${name}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setDestination(data);
        }
      })
      .catch(() => setError("Failed to load destination"));
  }, [name]);

  if (error) return <div className="destination-container"><h2>{error}</h2></div>;
  if (!destination) return <div className="destination-container"><p>Loading...</p></div>;

  const heroImagePath = destination.heroImage?.startsWith("http")
    ? destination.heroImage
    : destination.heroImage;

  const googleMapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(destination.name)}`;

  return (
    <div className="destination-container">
      <img className="hero-image" src={heroImagePath} alt={destination.name} />

      <div className="details-content">
        <h1>{destination.name}, {destination.country}</h1>
        <p className="tagline">{destination.tagline}</p>
        <p className="overview">{destination.overview}</p>

        <div className="section">
          <h3>🌟 Top Attractions</h3>
          <ul>
            {destination.topAttractions.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>

        <div className="section">
          <h3>📅 Best Time to Visit</h3>
          <p>{destination.bestTimeToVisit}</p>
        </div>

        <div className="section">
          <h3>⏳ Recommended Duration</h3>
          <p>{destination.recommendedDuration}</p>
        </div>

        <div className="section">
          <h3>💡 Local Tips</h3>
          <ul>
            {destination.localTips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </div>

        <div className="section">
          <h3>🌦️ Weather Summary</h3>
          <ul>
            {Object.entries(destination.weatherSummary || {}).map(([season, summary]) => (
              <li key={season}><strong>{season}:</strong> {summary}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h3>💬 Language & Currency</h3>
          <p><strong>Language:</strong> {destination.language}</p>
          <p><strong>Currency:</strong> {destination.currency}</p>
        </div>

        <div className="section">
          <h3>🗺️ Map</h3>
          <iframe
            title="map"
            src={googleMapEmbedUrl}
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetails;
