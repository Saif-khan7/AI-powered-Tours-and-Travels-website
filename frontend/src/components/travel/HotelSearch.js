import React, { useState } from 'react';
import { searchHotels } from '../../services/api';
import Spinner from '../common/Spinner';

/* Styled by .planner / .section / .input-group in App.css */
export default function HotelSearch() {
  const [cityCode, setCityCode]   = useState('');
  const [checkIn,  setCheckIn]    = useState('');
  const [checkOut, setCheckOut]   = useState('');
  const [adults,   setAdults]     = useState(1);

  const [offers,   setOffers]     = useState([]);
  const [error,    setError]      = useState('');
  const [loading,  setLoading]    = useState(false);

  const handleSearch = async () => {
    setError('');
    if (!cityCode || !checkIn || !checkOut) {
      setError('Please fill all fields'); return;
    }

    setLoading(true); setOffers([]);
    try {
      const data = await searchHotels({
        cityCode,
        checkInDate:  checkIn,
        checkOutDate: checkOut,
        adults
      });
      if (data.error)  setError(data.error);
      else             setOffers(data.data || []);
    } catch (e) {
      setError('Network or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="planner">
      <div className="section">
        <h2>🏨 Hotel Search</h2>

        <div className="input-group">
          <div>
            <label>City Code</label>
            <input  value={cityCode}
                    onChange={e=>setCityCode(e.target.value.toUpperCase())}
                    placeholder="e.g. PAR" />
          </div>
          <div>
            <label>Check‑In</label>
            <input type="date" value={checkIn}  onChange={e=>setCheckIn(e.target.value)} />
          </div>
          <div>
            <label>Check‑Out</label>
            <input type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} />
          </div>
          <div>
            <label>Adults</label>
            <input type="number" min="1" value={adults}
                   onChange={e=>setAdults(e.target.value)} />
          </div>
        </div>

        <button className="button" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching…' : '🔍 Search Hotels'}
        </button>

        {loading && <Spinner />}
        {error && <p style={{ color:'red' }}>{error}</p>}

        <div className="output-box" style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {offers.length === 0
            ? <p>No offers yet.</p>
            : offers.map((offer, i) => {
                const hotel    = offer.hotel || {};
                const name     = hotel.name || 'Unnamed Hotel';
                const price    = offer.offers?.[0]?.price?.total     || 'N/A';
                const currency = offer.offers?.[0]?.price?.currency  || '';
                return (
                  <div key={i} style={{ borderBottom:'1px solid #eee', padding:'10px 0' }}>
                    <strong>{name}</strong><br/>
                    Price: {price} {currency}
                  </div>
                );
              })
          }
        </div>
      </div>
    </section>
  );
}
