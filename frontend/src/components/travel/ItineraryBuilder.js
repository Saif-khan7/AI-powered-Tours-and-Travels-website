import React, { useState } from 'react';
import { generateItinerary } from '../../services/api';
import Spinner from '../common/Spinner';

function ItineraryBuilder() {
  const [destination, setDestination] = useState('');
  const [startDate,   setStartDate]   = useState('');
  const [endDate,     setEndDate]     = useState('');
  const [itinerary,   setItinerary]   = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  const handleGenerateItinerary = async () => {
    if (!destination || !startDate || !endDate) {
      setError('Please complete all fields.'); return;
    }
    setLoading(true); setError(''); setItinerary('');
    const prompt = `
Please create a day-by-day travel itinerary for the following trip:

- Destination: ${destination}
- Start Date: ${startDate}
- End Date: ${endDate}

Each day should be presented as a bullet point (dash at start).
Return plain text.
    `;

    try {
      const data = await generateItinerary({ prompt });
      setItinerary(data.reply || 'No reply received.');
    } catch (e) {
      setError('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="itinerary-builder" className="planner">
      <div className="section">
        <h2>🗺️ AI‑Based Itinerary Planner</h2>
        <p>Get a bullet‑proof day‑by‑day plan, powered by ML.</p>

        <div className="input-group">
          <div><label>Destination</label>
            <input value={destination} onChange={e=>setDestination(e.target.value)}
                   placeholder="e.g. Paris" /></div>
          <div><label>Start Date</label>
            <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} /></div>
          <div><label>End Date</label>
            <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} /></div>
        </div>

        <button className="button" onClick={handleGenerateItinerary} disabled={loading}>
          {loading ? 'Generating…' : '🧠 Generate Itinerary'}
        </button>

        {loading && <Spinner />}
        {error && <p className="error">{error}</p>}

        <div className="output-box">
          <strong>Your Itinerary:</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {itinerary || '(Fill details and click Generate)'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ItineraryBuilder;
