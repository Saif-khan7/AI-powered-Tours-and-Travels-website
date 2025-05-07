import React, { useState } from "react";
import { searchFlights } from "../../services/api";
import Spinner from "../common/Spinner";

/**
 * FlightSearch – works on free & paid Aviationstack plans.
 * Free plan: backend auto‑fallback to ONE filter, no date.
 */
function FlightSearch() {
  const [dep, setDep]   = useState("");
  const [arr, setArr]   = useState("");
  const [date, setDate] = useState("");
  const [flt, setFlt]   = useState("");

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [flights, setFlights] = useState([]);

  const clear = () => {
    setError("");
    setFlights([]);
  };

  const handleSearch = async () => {
    clear();

    if (![dep, arr, flt].some(Boolean)) {
      setError(
        "Enter at least one filter: departure IATA, arrival IATA, or flight number."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await searchFlights({
        dep_iata:      dep || undefined,
        arr_iata:      arr || undefined,
        flight_date:   date || undefined,
        flight_number: flt || undefined
      });

      if (res.error) {
        const msg =
          res.error.message || res.error.code || "Provider returned an error";
        setError(msg);
      } else if (Array.isArray(res.data) && res.data.length) {
        setFlights(res.data);
      } else {
        setError("No flights found for the given filters.");
      }
    } catch (e) {
      setError(e.message || "Network / server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="planner">
      <div className="section">
        <h2>✈️ Realtime Flight Search</h2>
        <p style={{ opacity: 0.75 }}>
        search by filter (dep/arr IATA or
          flight #). Date is optional.
        </p>

        {/* Inputs */}
        <div className="input-group">
          <div>
            <label>Departure IATA</label>
            <input
              placeholder="e.g. SFO"
              value={dep}
              onChange={(e) => setDep(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label>Arrival IATA</label>
            <input
              placeholder="e.g. JFK"
              value={arr}
              onChange={(e) => setArr(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label>Flight # (IATA)</label>
            <input
              placeholder="e.g. AA1004"
              value={flt}
              onChange={(e) => setFlt(e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label>Date (optional)</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Action */}
        <button className="button" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching…" : "🔍 Search Flights"}
        </button>

        {loading && <Spinner />}
        {error && <p className="error">{error}</p>}

        {/* Results */}
        {flights.length > 0 && (
          <div
            className="output-box"
            style={{ maxHeight: 380, overflowY: "auto" }}
          >
            {flights.map((f, i) => (
              <div
                key={i}
                style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}
              >
                <strong>{f.flight?.iata || "—"}</strong> —{" "}
                {f.airline?.name || "Unknown airline"}
                <br />
                {f.departure?.iata} → {f.arrival?.iata} |{" "}
                {f.flight_status || "status n/a"}
                {f.flight_date ? ` | ${f.flight_date}` : ""}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FlightSearch;   // ← default export
