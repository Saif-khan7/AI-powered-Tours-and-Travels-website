import React, { useState } from 'react';
import { recommendDestinations } from '../../services/api';
import Spinner from '../common/Spinner';

function Planner() {
  const [destinationType, setDestinationType]   = useState('Beach');
  const [budgetLevel,     setBudgetLevel]       = useState('Budget');
  const [tripDuration,    setTripDuration]      = useState(5);
  const [activities,      setActivities]        = useState('');
  const [preferredCountries, setPreferredCountries] = useState('');

  const [recommendation,  setRecommendation] = useState('');
  const [loading,         setLoading]        = useState(false);
  const [error,           setError]          = useState('');

  const handleGetRecommendations = async () => {
    setLoading(true); setError(''); setRecommendation('');
    const prompt = `
Please propose 3–4 suitable ${destinationType.toLowerCase()} destinations,
adhering to these preferences:
• Budget Level: ${budgetLevel}
• Trip Duration: ${tripDuration} days
• Activities: ${activities}
• Preferred Countries: ${preferredCountries}

For each recommended place:
– Provide a short name and location
– Give a brief overview (1–2 sentences)
– Mention a few key tips or attractions

Use simple dash (–) for bullet points (no asterisks, no markdown). 
Return the entire response in plain text, with each recommended place as a bullet item.
    `;

    try {
      const data = await recommendDestinations({ prompt });
      setRecommendation(data.reply || 'No reply received.');
    } catch (e) {
      setError('Server error. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="planner" className="planner">
      <div className="section">
        <h2>🧭 Personalized Trip Planner</h2>
        <p>Tell us your travel style – we’ll suggest perfect spots.</p>

        <div className="input-group">
          {/* quick inputs – unchanged HTML, shortened for brevity */}
          {/* … destinationType, budgetLevel, tripDuration, activities, preferredCountries … */}
          {/* Destination Type */}
          <div>
            <label>Destination Type</label>
            <select value={destinationType} onChange={e=>setDestinationType(e.target.value)}>
              <option>Beach</option><option>Mountains</option><option>City</option>
              <option>Historical</option><option>Nature</option>
            </select>
          </div>
          {/* Budget Level */}
          <div>
            <label>Budget Level</label>
            <select value={budgetLevel} onChange={e=>setBudgetLevel(e.target.value)}>
              <option>Budget</option><option>Moderate</option><option>Luxury</option>
            </select>
          </div>
          {/* Trip Duration */}
          <div>
            <label>Trip Duration (days)</label>
            <input type="number" min="1" value={tripDuration}
                   onChange={e=>setTripDuration(e.target.value)} />
          </div>
          {/* Activities */}
          <div>
            <label>Activities You Like</label>
            <input type="text" value={activities}
                   onChange={e=>setActivities(e.target.value)} />
          </div>
          {/* Preferred Countries */}
          <div>
            <label>Preferred Countries</label>
            <input type="text" value={preferredCountries}
                   onChange={e=>setPreferredCountries(e.target.value)} />
          </div>
        </div>

        <button className="button" onClick={handleGetRecommendations} disabled={loading}>
          {loading ? 'Fetching…' : '✨ Get Recommendations'}
        </button>

        {loading && <Spinner />}
        {error && <p className="error">{error}</p>}

        <div className="output-box">
          <strong>Recommended Destinations:</strong>
          <p style={{ whiteSpace: 'pre-wrap' }}>
            {recommendation || '(Results will appear here)'}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Planner;
